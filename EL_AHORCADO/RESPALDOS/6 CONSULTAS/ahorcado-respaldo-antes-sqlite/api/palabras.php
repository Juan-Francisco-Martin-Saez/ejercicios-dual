<?php
declare(strict_types=1);
// PHP 8.1+, cURL. Instalar como api/palabras.php. api/datos debe ser privada y escribible.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Cross-Origin-Resource-Policy: same-origin');
ini_set('display_errors','0');
const WORD_TARGET = 3000;
const WORD_MONTHLY_ADD = 750; // Puede cambiarse a 500 o 1000.
const WORD_POLICY = 'descubrimiento-cultural-v5';
const WORD_LEVELS = ['easy','medium','hard','expert'];
// Son temas de búsqueda, NO una lista cerrada de respuestas.
const WORD_SOURCES = [
 ['Películas',['Películas de aventuras','Películas de ciencia ficción','Películas de drama','Películas de comedia','Películas de terror']],
 ['Series de ficción',['Series de televisión de comedia','Series de televisión de drama','Series de televisión de ciencia ficción','Series de televisión de fantasía']],
 ['Películas de animación',['Películas de animación de Disney','Películas de Pixar','Películas de Studio Ghibli','Películas de animación']],
 ['Series de animación',['Series de televisión animadas','Series de anime','Series de televisión animadas de Estados Unidos']],
 ['Programas de televisión',['Concursos televisivos','Programas de televisión de España','Talk shows','Reality shows']],
 ['Videojuegos',['Videojuegos de plataformas','Videojuegos de rol','Videojuegos de acción','Videojuegos de aventura']],
 ['Libros',['Novelas de aventuras','Novelas de ciencia ficción','Novelas de fantasía','Novelas policíacas','Obras literarias']],
 ['Cantantes y grupos',['Cantantes de España','Cantantes de Estados Unidos','Grupos de rock','Grupos de pop','Cantantes de México']],
 ['Canciones',['Canciones de rock','Canciones de pop','Canciones en español','Canciones en inglés']],
 ['Lugares y monumentos',['Monumentos de España','Patrimonio de la Humanidad','Ciudades','Montañas','Ríos']],
 ['Figuras históricas y públicas',['Científicos','Exploradores','Emperadores','Presidentes','Filósofos']],
 ['Personajes de ficción',['Personajes de historieta','Personajes de videojuegos','Personajes de literatura','Superhéroes']],
 ['Gastronomía',['Platos de arroz','Gastronomía de España','Postres','Gastronomía de Italia','Gastronomía de México']],
 ['Arte',['Pinturas','Esculturas','Pintores','Escultores','Movimientos artísticos']],
 ['Deportes',['Deportes','Futbolistas','Tenistas','Baloncestistas','Competiciones deportivas']],
 ['Cultura friki',['Objetos ficticios','Tecnología de Star Wars','Lugares de la Tierra Media','Vehículos ficticios','Universos ficticios']]
];
function wordsReply(int $status,array $data): never {
 http_response_code($status); echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR); exit;
}
function wordsUpper(string $text): string { return strtoupper(strtr($text,['á'=>'Á','é'=>'É','í'=>'Í','ó'=>'Ó','ú'=>'Ú','ü'=>'Ü','ñ'=>'Ñ'])); }
function wordsKey(string $text): string {
 return trim(preg_replace('/\s+/u',' ',preg_replace('/[^A-ZÑ ]/u',' ',strtr(wordsUpper($text),['Á'=>'A','É'=>'E','Í'=>'I','Ó'=>'O','Ú'=>'U','Ü'=>'U']))));
}
function wordsRead(string $file): ?array {
 if(!is_file($file))return null;
 $data=json_decode((string)file_get_contents($file),true,512,JSON_THROW_ON_ERROR);
 if(!is_array($data))throw new RuntimeException('JSON no válido.');
 if(preg_match('/^(online-.*|catalogo-progreso|descubrimientos)\.json$/',basename($file))&&($data['recognitionPolicy']??'')!==WORD_POLICY)return null;
 return $data;
}
function wordsWrite(string $file,array $data): void {
 $data['recognitionPolicy']=WORD_POLICY; $temp=tempnam(dirname($file),'words_');
 if($temp===false)throw new RuntimeException('No se puede guardar.');
 try {
  $json=json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
  if(file_put_contents($temp,$json)!==strlen($json)||!rename($temp,$file))throw new RuntimeException('No se puede guardar.');
 } finally {if(is_file($temp))unlink($temp);}
}
function wordsHttp(array $params,int $timeout=20): array {
 $activity=__DIR__.'/datos/busqueda-online-actividad.txt';
 if(defined('AHORCADO_BACKGROUND_SYNC')&&AHORCADO_BACKGROUND_SYNC) {
  // Solo ralentizar el mantenimiento: nunca las consultas de una partida.
  static $lastRequest=0.0;
  $wait=1.0-(microtime(true)-$lastRequest);
  if($wait>0)usleep((int)ceil($wait*1000000));
  clearstatcache(true,$activity);
  if(is_file($activity)&&(int)filemtime($activity)>time()-120)
   throw new RuntimeException('Actualización en pausa: búsqueda online reciente.');
  $lastRequest=microtime(true);
 } elseif(PHP_SAPI!=='cli') {
  // Marca privada de actividad; no contiene respuestas ni datos del jugador.
  @touch($activity);
 }
 if(!function_exists('curl_init'))throw new RuntimeException('Falta cURL.');
 $curl=curl_init('https://es.wikipedia.org/w/api.php?'.http_build_query($params+['format'=>'json','formatversion'=>2,'maxlag'=>5]));
 curl_setopt_array($curl,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>min(10,$timeout),CURLOPT_TIMEOUT=>$timeout,
  CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_USERAGENT=>'ReijohanAhorcado/5.0 (cultural word game)']);
 $body=curl_exec($curl); $status=curl_getinfo($curl,CURLINFO_HTTP_CODE); $error=curl_error($curl); curl_close($curl);
 if($body===false||$status!==200)throw new RuntimeException('Fuente no disponible: '.$status.' '.$error);
 $data=json_decode($body,true,512,JSON_THROW_ON_ERROR);
 if(isset($data['error']))throw new RuntimeException('Consulta rechazada: '.($data['error']['code']??''));
 return $data;
}
// Solo se acepta una categoría si la introducción y las categorías propias la respaldan.
// No se usa el texto completo: allí aparecen menciones a otras obras y plantillas compartidas.
function wordsCategory(array $page): ?string {
 $intro=wordsKey(mbSafeSlice((string)($page['extract']??''),1000));
 $cats=wordsKey(implode(' ',array_column($page['categories']??[],'title')));
 $has=fn(string $pattern)=>preg_match('~'.$pattern.'~u',$intro)===1;
 $cat=fn(string $pattern)=>preg_match('~'.$pattern.'~u',$cats)===1;
 if($has(' ES | FUE | SON ')) {
  if($has(' (ES|FUE) UNA PELICULA')&&$cat('PELICULAS'))return ($cat('PELICULAS DE ANIMACION|PELICULAS DE PIXAR|PELICULAS DE STUDIO GHIBLI')||$has(' (ES|FUE) UNA PELICULA (ANIMADA|DE ANIMACION|DE ANIME)'))?'Películas de animación':'Películas';
  if($has(' (ES|FUE) UNA SERIE (DE TELEVISION |TELEVISIVA |ANIMADA |DE ANIME|DE ANIMACION)')&&$cat('SERIES'))return ($cat('SERIES.*ANIMAD|SERIES DE ANIME')||$has(' (ES|FUE) UNA SERIE (ANIMADA|DE ANIMACION|DE ANIME)'))?'Series de animación':'Series de ficción';
  if($has('PROGRAMA (DE TELEVISION|TELEVISIVO)|CONCURSO (DE TELEVISION|TELEVISIVO)|REALITY SHOW|TALK SHOW')&&$cat('PROGRAMAS DE TELEVISION|CONCURSOS TELEVISIVOS|REALITY SHOWS|TALK SHOWS'))return 'Programas de televisión';
  if($has(' (ES|FUE) UN VIDEOJUEGO')&&$cat('VIDEOJUEGOS'))return 'Videojuegos';
  if($has('NOVELA|LIBRO|OBRA (LITERARIA|TEATRAL)|POEMARIO')&&$cat('NOVELAS|LIBROS|OBRAS LITERARIAS|OBRAS DE TEATRO'))return 'Libros';
  if($has('CANCION|SENCILLO')&&$cat('CANCIONES|SENCILLOS'))return 'Canciones';
  if($has('CANTANTE|BANDA (DE |MUSICAL)|GRUPO (MUSICAL|DE ROCK|DE POP)')&&$cat('CANTANTES|GRUPOS|BANDAS'))return 'Cantantes y grupos';
  if($has('PERSONAJE (FICTICIO|DE FICCION)|SUPERHEROE|SUPERVILLANO')&&$cat('PERSONAJES|SUPERHEROES|SUPERVILLANOS'))return 'Personajes de ficción';
  if($has('PLATO|POSTRE|ALIMENTO|DULCE|BEBIDA|SALSA|SOPA|PASTA|QUESO|PAN ')&&$cat('GASTRONOMIA|PLATOS|POSTRES|ALIMENTOS|BEBIDAS|QUESOS|PANES|SALSAS'))return 'Gastronomía';
  if($has('PINTOR|PINTORA|ESCULTOR|ESCULTORA|PINTURA|CUADRO|ESCULTURA|MOVIMIENTO (ARTISTICO|PICTORICO)')&&$cat('PINTOR|ESCULTOR|PINTURAS|CUADROS|ESCULTURAS|MOVIMIENTOS ARTISTICOS'))return 'Arte';
  if($has('DEPORTE|FUTBOLISTA|TENISTA|BALONCESTISTA|ATLETA|PILOTO DE|COMPETICION|TORNEO|CAMPEONATO|CLUB DE FUTBOL')&&$cat('DEPORT|FUTBOL|TENIS|BALONCEST|ATLET|PILOTOS|TORNEOS|CAMPEONATOS'))return 'Deportes';
  if($has('CIUDAD|MUNICIPIO|CAPITAL|MONUMENTO|TORRE|CATEDRAL|PALACIO|TEMPLO|MONTANA|RIO |ISLA|LAGO|DESIERTO')&&$cat('CIUDADES|LOCALIDADES|MUNICIPIOS|MONUMENTOS|PATRIMONIO|TORRES|CATEDRALES|PALACIOS|TEMPLOS|MONTANAS|RIOS|ISLAS|LAGOS|DESIERTOS'))return 'Lugares y monumentos';
  if($has('CIENTIFICO|CIENTIFICA|FISICO|FISICA|FILOSOFO|FILOSOFA|EMPERADOR|EMPERATRIZ|PRESIDENTE|POLITICO|POLITICA|EXPLORADOR|REY |REINA |INVENTOR')&&$cat('CIENTIFIC|FISICOS|FILOSOF|EMPERADOR|EMPERATR|PRESIDENT|POLITIC|EXPLORADOR|REYES|REINAS|INVENTOR'))return 'Figuras históricas y públicas';
 }
 if($has('FICTICI|DE FICCION')&&$has('OBJETO|ARMA|VEHICULO|NAVE|PLANETA|UNIVERSO|MUNDO|LUGAR')&&$cat('OBJETOS FICTICIOS|VEHICULOS FICTICIOS|UNIVERSOS FICTICIOS|STAR WARS|TIERRA MEDIA'))return 'Cultura friki';
 return null;
}
function mbSafeSlice(string $s,int $limit): string {return implode('',array_slice(preg_split('//u',$s,-1,PREG_SPLIT_NO_EMPTY)?:[],0,$limit));}
function wordsItem(array $page,string $category): ?array {
 if(($page['ns']??-1)!==0||isset($page['missing'])||isset($page['pageprops']['disambiguation'])||wordsCategory($page)!==$category)return null;
 $title=(string)($page['title']??'');
 if(preg_match('/^(Anexo:|Lista de|Historia de|Temporada|Episodio|Discografía)/iu',$title))return null;
 // Quitar únicamente el desambiguador; los números y signos incompatibles con el teclado se descartan.
 $text=wordsUpper(trim(preg_replace('/\s*\([^()]*\)$/u','',$title)));
 $length=preg_match_all('/./us',$text);
 if($length<3||$length>65||preg_match('/[^A-ZÁÉÍÓÚÜÑ \-–—\x{2019}\x{0027}.,:!?¡¿]/u',$text))return null;
 $views=array_values(array_filter($page['pageviews']??[],fn($v)=>is_numeric($v)&&$v>=0));
 if(count($views)<14)return null; // Sin evidencia suficiente, no adivinar el reconocimiento.
 sort($views); $median=(float)$views[intdiv(count($views),2)];
 $languages=count($page['langlinks']??[]);
 // Indicadores aproximados, NO garantía editorial de que todos conozcan la respuesta.
 // Mediana mensual evita que una noticia puntual convierta algo desconocido en nivel fácil.
 if($median<20||$languages<8)return null;
 $level=(($median>=500&&$languages>=30)||($median>=80&&$languages>=55))?'easy':($median>=50&&$languages>=25?'medium':($median>=25&&$languages>=15?'hard':'expert'));
 return ['id'=>wordsKey($text),'text'=>$text,'category'=>$category,'level'=>$level,'source'=>'internet',
  'sourceUrl'=>'https://es.wikipedia.org/?curid='.(int)$page['pageid'],'recognitionPolicy'=>WORD_POLICY,
  'evidence'=>['medianDailyViews'=>$median,'languages'=>$languages,'checkedAt'=>gmdate('c')]];
}
// Compatible con llamadas existentes de partida.php; el cuarto argumento filtra el nivel.
function wikiSearch(int $source,int $offset,int $limit,string $level='all'): array {
 $deadline=microtime(true)+40;
 if(!isset(WORD_SOURCES[$source])||!in_array($level,array_merge(['all'],WORD_LEVELS),true))throw new InvalidArgumentException('Filtro no válido.');
 $topics=WORD_SOURCES[$source][1]; $topic=$topics[random_int(0,count($topics)-1)];
 // Variar temas y páginas; siempre consulta web nueva, nunca lee el catálogo offline.
 $offset=max(0,min(1000,$offset));
 $query='deepcat:"'.$topic.'"';
 try {$search=wordsHttp(['action'=>'query','list'=>'search','srsearch'=>$query,'srnamespace'=>0,'srlimit'=>min(20,max(1,$limit)),
  'sroffset'=>$offset,'srsort'=>'incoming_links_desc','srprop'=>'','srinfo'=>'totalhits']);}
 catch(RuntimeException $e) {
  if(!str_contains($e->getMessage(),'cirrussearch'))throw $e;
  $search=wordsHttp(['action'=>'query','list'=>'search','srsearch'=>'incategory:"'.$topic.'"','srnamespace'=>0,'srlimit'=>min(20,max(1,$limit)),'sroffset'=>$offset,'srsort'=>'incoming_links_desc','srprop'=>'']);
 }
 $hits=$search['query']['search']??[];
 if(!$hits)return ['entries'=>[],'next'=>null,'total'=>$search['query']['searchinfo']['totalhits']??0];
 $params=['action'=>'query','pageids'=>implode('|',array_column($hits,'pageid')),
  'prop'=>'pageprops|categories|extracts|langlinks|pageviews','ppprop'=>'disambiguation','clshow'=>'!hidden','cllimit'=>'max',
  'exintro'=>1,'explaintext'=>1,'exlimit'=>20,'lllimit'=>'max','pvipdays'=>30];
 $pages=[]; $continuation=[];
 // Continuaciones reales para no clasificar con categorías o idiomas truncados.
 for($i=0;$i<12;$i++) {
  $remaining=(int)floor($deadline-microtime(true));
  if($remaining<1)throw new RuntimeException('Tiempo de consulta agotado.');
  $data=wordsHttp($params+$continuation,min(20,$remaining));
  foreach($data['query']['pages']??[] as $page) {
   $id=$page['pageid']; $previous=$pages[$id]??[];
   foreach(['categories','langlinks'] as $field)if(isset($previous[$field]))$page[$field]=array_merge($previous[$field],$page[$field]??[]);
   $pages[$id]=array_replace($previous,$page);
  }
  $continuation=$data['continue']??[]; if(!$continuation)break;
 }
 if($continuation)throw new RuntimeException('Metadatos incompletos; se descarta el lote.');
 $entries=[];
 foreach($pages as $page) {
  $item=wordsItem($page,WORD_SOURCES[$source][0]);
  if($item&&($level==='all'||$item['level']===$level))$entries[$item['id']]=$item;
 }
 $entries=array_values($entries); shuffle($entries);
 wordsRemember($entries);
 return ['entries'=>$entries,'next'=>$search['continue']['sroffset']??null,'total'=>$search['query']['searchinfo']['totalhits']??count($hits)];
}
function wordsQualified(array $entries): array {
 $unique=[];
 foreach($entries as $entry)if(is_array($entry)&&($entry['recognitionPolicy']??'')===WORD_POLICY&&isset($entry['text'],$entry['category'],$entry['level'])
  &&in_array($entry['category'],array_column(WORD_SOURCES,0),true)&&in_array($entry['level'],WORD_LEVELS,true)) {
  $entry['id']=wordsKey($entry['text']); if($entry['id']!=='')$unique[$entry['id']]=$entry;
 }
 return array_values($unique);
}
function wordsRemember(array $entries): void {
 if(!$entries)return;
 $dir=__DIR__.'/datos'; if(!is_dir($dir))throw new RuntimeException('Falta api/datos.');
 $lock=fopen($dir.'/descubrimientos.lock','c');
 if(!$lock||!flock($lock,LOCK_EX))throw new RuntimeException('No se puede bloquear el archivo.');
 try {
  $old=wordsRead($dir.'/descubrimientos.json');
  wordsWrite($dir.'/descubrimientos.json',['updatedAt'=>gmdate('c'),'entries'=>wordsQualified(array_merge($old['entries']??[],$entries))]);
 } finally {flock($lock,LOCK_UN);fclose($lock);}
}
function wordsCatalog(): array {
 $catalog=wordsRead(__DIR__.'/datos/catalogo-mensual.json');
 if(!$catalog||($catalog['recognitionPolicy']??'')!==WORD_POLICY)$catalog=wordsRead(dirname(__DIR__).'/catalogo-inicial.json');
 // El catálogo antiguo mal clasificado no se presenta como revisado.
 $entries=wordsQualified($catalog['entries']??[]);
 return ['version'=>5,'month'=>$catalog['month']??null,'updatedAt'=>$catalog['updatedAt']??null,'count'=>count($entries),
  'target'=>WORD_TARGET,'recognitionPolicy'=>WORD_POLICY,'entries'=>$entries,'stale'=>($catalog['month']??'')!==gmdate('Y-m')];
}
function wordsSync(): array {
 $dir=__DIR__.'/datos'; $lock=fopen($dir.'/catalogo.lock','c');
 if(!$lock||!flock($lock,LOCK_EX|LOCK_NB)){if(is_resource($lock))fclose($lock);return ['ready'=>false,'busy'=>true];}
 try {
  $catalog=wordsCatalog(); $month=gmdate('Y-m'); $state=wordsRead($dir.'/catalogo-progreso.json');
  if(($catalog['month']??'')===$month&&$catalog['count']>=WORD_TARGET)return ['ready'=>true,'count'=>$catalog['count'],'catalog'=>$catalog];
  if(!$state||($state['month']??'')!==$month)$state=['month'=>$month,'baseCount'=>$catalog['count'],'target'=>max(WORD_TARGET,$catalog['count']+WORD_MONTHLY_ADD),'turn'=>0];
  $pool=wordsRead($dir.'/descubrimientos.json'); $all=wordsQualified(array_merge($catalog['entries'],$pool['entries']??[]));
  if(count($all)<$state['target']) {
   // Un lote por ejecución: reanudar con visitas o cron; no bloquear una petición durante minutos.
   $turn=(int)$state['turn']; $source=$turn%count(WORD_SOURCES); $level=WORD_LEVELS[intdiv($turn,count(WORD_SOURCES))%4];
   $ranges=['easy'=>[0,60],'medium'=>[0,180],'hard'=>[0,400],'expert'=>[0,800]];
   [$lo,$hi]=$ranges[$level]; $state['turn']++; wordsWrite($dir.'/catalogo-progreso.json',$state);
   $batch=defined('AHORCADO_BACKGROUND_SYNC')&&AHORCADO_BACKGROUND_SYNC?6:20;
   $result=wikiSearch($source,random_int($lo,intdiv($hi,20))*20,$batch,'all');
   $all=wordsQualified(array_merge($all,$result['entries']));
  }
  // Rotación por categoría y dificultad al elegir nuevas entradas, conservando todas las anteriores.
  $existing=array_fill_keys(array_column($catalog['entries'],'id'),true); $buckets=[];
  foreach($all as $entry)if(!isset($existing[$entry['id']]))$buckets[$entry['category'].'/'.$entry['level']][]=$entry;
  $entries=$catalog['entries'];
  do {$changed=false;foreach($buckets as &$bucket)if($bucket&&count($entries)<$state['target']){$entries[]=array_shift($bucket);$changed=true;}unset($bucket);}while($changed&&count($entries)<$state['target']);
  $ready=count($entries)>=$state['target'];
  $published=['version'=>5,'month'=>$ready?$month:($catalog['month']??null),'updatedAt'=>gmdate('c'),'count'=>count($entries),
   'target'=>$state['target'],'recognitionPolicy'=>WORD_POLICY,'entries'=>$entries];
  if(count($entries)>$catalog['count']||$ready)wordsWrite($dir.'/catalogo-mensual.json',$published);
  wordsWrite($dir.'/catalogo-progreso.json',$state);
  return ['ready'=>$ready,'count'=>count($entries),'target'=>$state['target'],'added'=>count($entries)-$state['baseCount'],'catalog'=>$ready?$published:null];
 } finally {flock($lock,LOCK_UN);fclose($lock);}
}
if(defined('AHORCADO_WORDS_LIBRARY'))return;
if(($_SERVER['HTTP_SEC_FETCH_SITE']??'')==='cross-site')wordsReply(403,['error'=>'Solicitud no permitida.']);
if(PHP_SAPI==='cli')$action=$argv[1]??'sync';
else {
 if(($_SERVER['REQUEST_METHOD']??'GET')!=='GET'){header('Allow: GET');wordsReply(405,['error'=>'Método no permitido.']);}
 $action=$_GET['action']??'catalog';
}
try {
 if(!is_dir(__DIR__.'/datos'))throw new RuntimeException('Falta api/datos.');
 if($action==='catalog')wordsReply(200,wordsCatalog());
 if($action==='sync')wordsReply(200,PHP_SAPI==='cli'?wordsSync():['ready'=>false,'managedBy'=>'cron']);
 if($action!=='search')wordsReply(400,['error'=>'Solicitud no válida.']);
 $level=$_GET['level']??'all'; $category=$_GET['category']??'all';
 if(!is_string($level)||!in_array($level,array_merge(['all'],WORD_LEVELS),true))wordsReply(400,['error'=>'Dificultad no válida.']);
 if(!is_string($category))wordsReply(400,['error'=>'Categoría no válida.']);
 $source=$category==='all'?random_int(0,count(WORD_SOURCES)-1):array_search($category,array_column(WORD_SOURCES,0),true);
 if($source===false)wordsReply(400,['error'=>'Categoría no válida.']);
 $max=['all'=>400,'easy'=>40,'medium'=>160,'hard'=>400,'expert'=>800][$level];
 $result=wikiSearch($source,random_int(0,intdiv($max,20))*20,20,$level);
 if(!$result['entries'])wordsReply(503,['error'=>'No se ha encontrado un enigma con esos filtros. Prueba otra búsqueda.','origin'=>'internet']);
 wordsReply(200,['entries'=>$result['entries'],'origin'=>'internet','searchedAt'=>gmdate('c'),'category'=>WORD_SOURCES[$source][0],'level'=>$level]);
} catch(Throwable $error) {
 error_log('Motor ahorcado: '.$error->getMessage());
 wordsReply(503,['error'=>'No se ha podido completar la búsqueda. El catálogo guardado se conserva.']);
}
