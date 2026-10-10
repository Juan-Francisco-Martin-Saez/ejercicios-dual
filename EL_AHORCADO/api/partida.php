<?php
declare(strict_types=1);
header('X-Ahorcado-Diagnostico: revision-1');
require __DIR__.'/sesion.php';
$data=gameInput();$action=$data['action']??'';
if (!in_array($action,['start','next','guess','prefetch'],true)) gameReply(400,['error'=>'Acción no válida.']);
// Límite por sesión; la precarga libera el bloqueo durante la búsqueda.
$now=microtime(true);$rate=$_SESSION['rate']??['since'=>$now,'count'=>0];
if ($now-$rate['since']>=60) $rate=['since'=>$now,'count'=>0];
if (++$rate['count']>180) {header('Retry-After: 60');gameReply(429,['error'=>'Demasiadas solicitudes. Espera un minuto.']);}
$_SESSION['rate']=$rate;
define('AHORCADO_WORDS_LIBRARY',true);require __DIR__.'/palabras.php';
function gameMask(array $round): string {
    $out='';foreach(preg_split('//u',$round['item']['text'],-1,PREG_SPLIT_NO_EMPTY) as $ch){
        $key=strtr(wordsUpper($ch),['Á'=>'A','É'=>'E','Í'=>'I','Ó'=>'O','Ú'=>'U','Ü'=>'U']);
        $out.=preg_match('/^[A-ZÑ]$/u',$key)&&!in_array($key,$round['guessed'],true)&&$round['status']==='playing'?'_':$ch;
    }return $out;
}
function gameState(array $run): array {
    $r=$run['round'];$item=$r['item'];
    return ['token'=>$run['token'],'score'=>$run['score'],'round'=>['id'=>$r['id'],'text'=>gameMask($r),'category'=>$item['category'],'level'=>$item['level'],'origin'=>$r['origin'],'status'=>$r['status'],'errors'=>$r['errors'],'guessed'=>$r['guessed']]];
}
function gameFindEnigma(int $source,string $level,array $seen): ?array {
    // Una consulta nueva por petición. No leer online-N.json ni el catálogo offline.
    // La precarga usa los mismos filtros y límites de palabras.php.
    $ranges=['all'=>200,'easy'=>40,'medium'=>120,'hard'=>240,'expert'=>400];
    $categoryCaps=[300,80,80,80,40,200,160,200,200,300,300,120,40,160,160,20];
    $max=min($ranges[$level],$categoryCaps[$source]??200);
    $offset=random_int(0,intdiv($max,20))*20;
    $result=wikiSearch($source,$offset,20,$level);
    $category=WORD_SOURCES[$source][0];
    $available=[];
    foreach(wordsQualified($result['entries']??[]) as $item) {
        if($item['category']!==$category||($level!=='all'&&$item['level']!==$level)||isset($seen[$item['id']]))continue;
        // Solo admitir respuestas compatibles con el teclado del juego.
        $length=preg_match_all('/./us',$item['text']);
        if($length<3||$length>65||preg_match('/[^A-ZÁÉÍÓÚÜÑ \-–—\x{2019}\x{0027}.,:!?¡¿]/u',$item['text']))continue;
        $available[]=$item;
    }
    return $available?$available[random_int(0,count($available)-1)]:null;
}
try {
    if ($action==='start') {
        $name=$data['nombre']??null;
        if (!is_string($name)) gameReply(400,['error'=>'Nombre no válido.']);
        $name=trim(preg_replace('/\s+/u',' ',$name)??'');$length=preg_match_all('/./us',$name);
        if (!$length || $length>24 || preg_match('/[\x00-\x1F\x7F]/u',$name)) gameReply(400,['error'=>'Nombre no válido.']);
        // La misma operación se puede reintentar sin reiniciar la partida.
        $request=$data['requestId']??'';
        if (!is_string($request)||!preg_match('/^[a-f0-9]{32}$/D',$request)) gameReply(400,['error'=>'Solicitud no válida.']);
        if (isset($_SESSION['run']) && ($_SESSION['run']['startRequest']??'')===$request
            && !($_SESSION['run']['ended']??false) && time()-$_SESSION['run']['created']<=86400) gameReply(200,gameState($_SESSION['run']));
        $run=['token'=>bin2hex(random_bytes(32)),'id'=>bin2hex(random_bytes(16)),'nombre'=>$name,'created'=>time(),'score'=>0,'ended'=>false,'seen'=>[],'startRequest'=>$request];
    } else {
        $run=gameRun(is_string($data['token']??null)?$data['token']:'');
        if ($run['ended']) gameReply(409,['error'=>'La partida ya está terminada.']);
    }
    if ($action==='guess') {
        if (!is_string($data['roundId']??null)||!hash_equals($run['round']['id'],$data['roundId'])) gameReply(409,['error'=>'El enigma ya ha cambiado.']);
        $r=&$run['round'];$request=$data['requestId']??'';
        if (!is_string($request)||!preg_match('/^[a-f0-9]{32}$/D',$request)) gameReply(400,['error'=>'Solicitud no válida.']);
        if (($r['lastRequest']??'')===$request) gameReply(200,gameState($run));
        if ($r['status']!=='playing') gameReply(200,gameState($run));
        $value=$data['value']??null;
        if (!is_string($value)||strlen($value)>240) gameReply(400,['error'=>'Respuesta no válida.']);
        $value=wordsKey($value);if (!$value) gameReply(400,['error'=>'Respuesta no válida.']);
        $answer=wordsKey($r['item']['text']);
        if (preg_match('/^[A-ZÑ]$/u',$value)) {
            if (!in_array($value,$r['guessed'],true)) { $r['guessed'][]=$value;if (!str_contains($answer,$value)) $r['errors']++; }
            $letters=array_unique(preg_split('//u',str_replace(' ','',$answer),-1,PREG_SPLIT_NO_EMPTY));
            if (!array_diff($letters,$r['guessed'])) $r['status']='won';
        } elseif ($value===$answer) $r['status']='won';else $r['errors']++;
        if ($r['status']==='won') $run['score']++;elseif($r['errors']>=9)$r['status']='lost';
        $r['lastRequest']=$request;$_SESSION['run']=$run;gameReply(200,gameState($run));
    }
    if ($action==='next') {
        $previous=$data['roundId']??'';
        if (!is_string($previous)||!preg_match('/^[a-f0-9]{32}$/D',$previous)) gameReply(400,['error'=>'Enigma no válido.']);
        // Reintento de la misma continuación: devolver el enigma ya creado.
        if (($run['round']['previous']??null)===$previous) gameReply(200,gameState($run));
        if (!is_string($previous)||!hash_equals($run['round']['id'],$previous)||$run['round']['status']!=='won') gameReply(409,['error'=>'Resuelve el enigma antes de continuar.']);
    }
    $level=$data['level']??'all';
    if(!is_string($level)||!in_array($level,['all','easy','medium','hard','expert'],true))gameReply(400,['error'=>'Dificultad no válida.']);
    $category=$data['category']??'all';
    if(!is_string($category))gameReply(400,['error'=>'Categoría no válida.']);
    if($action==='prefetch') {
        $roundId=$data['roundId']??'';
        if(!is_string($roundId)||!hash_equals($run['round']['id'],$roundId))gameReply(409,['error'=>'El enigma ya ha cambiado.']);
        if($run['round']['status']==='lost')gameReply(409,['error'=>'La partida ya no admite precarga.']);
        $filters=['category'=>$category,'level'=>$level];$cached=$run['prefetched']??null;
        if($cached&&$cached['roundId']===$roundId&&$cached['filters']===$filters)gameReply(200,['ready'=>true,'roundId'=>$roundId]);
        $pending=$run['prefetchPending']??null;
        if($pending&&time()-$pending['created']<90)gameReply(202,['ready'=>false,'roundId'=>$roundId]);
        if($category==='all') {
            $sources=array_values(array_filter(array_keys(WORD_SOURCES),fn($i)=>$i!==($run['lastSource']??null)));
            $source=$sources[random_int(0,count($sources)-1)];
        } else {
            $source=array_search($category,array_column(WORD_SOURCES,0),true);
            if($source===false)gameReply(400,['error'=>'Categoría no válida.']);
        }
        $reservation=bin2hex(random_bytes(16));$runId=$run['id'];$seen=$run['seen'];
        unset($run['prefetched']);
        $run['prefetchPending']=['id'=>$reservation,'created'=>time(),'roundId'=>$roundId,'filters'=>$filters];
        $_SESSION['run']=$run;
        // Permitir que guess responda mientras se consulta internet.
        session_write_close();
        try {$item=gameFindEnigma($source,$level,$seen);}
        catch(Throwable $searchError) {
            if(!session_start())throw new RuntimeException('No se puede recuperar la sesión.');
            if(($_SESSION['run']['prefetchPending']['id']??null)===$reservation)unset($_SESSION['run']['prefetchPending']);
            throw $searchError;
        }
        if(!session_start())throw new RuntimeException('No se puede recuperar la sesión.');
        // Leer el estado actual, sin sobrescribir letras ni puntos recibidos durante la búsqueda.
        $current=$_SESSION['run']??null;
        $valid=$current&&$current['id']===$runId&&!$current['ended']
            &&$current['round']['id']===$roundId&&$current['round']['status']!=='lost'
            &&($current['prefetchPending']['id']??null)===$reservation;
        if(($current['prefetchPending']['id']??null)===$reservation)unset($_SESSION['run']['prefetchPending']);
        if(!$valid)gameReply(409,['error'=>'La partida ha cambiado; se descarta la precarga.']);
        if(!$item||isset($current['seen'][$item['id']]))gameReply(503,['error'=>'No se ha encontrado un próximo enigma con esos filtros.']);
        $_SESSION['run']['prefetched']=['roundId'=>$roundId,'filters'=>$filters,'source'=>$source,'item'=>$item];
        // La respuesta permanece solo en el servidor; no cuenta como palabra resuelta.
        gameReply(200,['ready'=>true,'roundId'=>$roundId]);
    }
    if($category==='all') {
        $sources=array_keys(WORD_SOURCES);
        // Alternar categorías cuando no se ha elegido una concreta.
        $sources=array_values(array_filter($sources,fn($i)=>$i!==($run['lastSource']??null)));
        $source=$sources[random_int(0,count($sources)-1)];
    } else {
        $source=array_search($category,array_column(WORD_SOURCES,0),true);
        if($source===false)gameReply(400,['error'=>'Categoría no válida.']);
    }
    if(!function_exists('wordsQualified')||WORD_POLICY!=='descubrimiento-cultural-v5')throw new RuntimeException('Actualizar palabras.php junto con partida.php.');
    $cached=$run['prefetched']??null;$filters=['category'=>$category,'level'=>$level];
    if($action==='next'&&$cached&&$cached['roundId']===$previous&&$cached['filters']===$filters
        &&!isset($run['seen'][$cached['item']['id']])) {
        $item=$cached['item'];$source=$cached['source'];
    } else {
        $pending=$run['prefetchPending']??null;
        if($action==='next'&&$pending&&$pending['roundId']===$previous&&$pending['filters']===$filters&&time()-$pending['created']<90)
            gameReply(409,['error'=>'El siguiente enigma se está preparando.','code'=>'prefetch_pending','retryAfter'=>1]);
        $item=gameFindEnigma($source,$level,$run['seen']);
    }
    if(!$item)gameReply(503,['error'=>'La búsqueda no ha encontrado un enigma nuevo con esos filtros. Reintenta; tu puntuación se conserva.']);
    unset($run['prefetched'],$run['prefetchPending']);
    $run['seen'][$item['id']]=true;$run['lastSource']=$source;
    $run['round']=['id'=>bin2hex(random_bytes(16)),'previous'=>$action==='next'?$data['roundId']:null,'item'=>$item,'guessed'=>[],'errors'=>0,'status'=>'playing','origin'=>'internet'];
    $_SESSION['run']=$run;gameReply(200,gameState($run));
}catch(Throwable $e){
    $message='Partida ahorcado: '.$e->getMessage();
    error_log($message);
    @file_put_contents(__DIR__.'/datos/partida-error.log',gmdate('c').' '.$message.PHP_EOL,FILE_APPEND|LOCK_EX);
    gameReply(503,['error'=>'No se puede consultar la web ahora. Reintenta o juega offline sin ranking.']);
}
