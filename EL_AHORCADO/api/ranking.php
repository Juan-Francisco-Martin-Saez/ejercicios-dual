<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Cross-Origin-Resource-Policy: same-origin');
ini_set('display_errors', '0');
require __DIR__.'/sesion.php';
// El juego usa solicitudes del mismo origen; no aceptar llamadas de otros sitios.
if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') {
    http_response_code(403);
    echo '{"error":"Solicitud no permitida."}';
    exit;
}

function reply(int $code, array $data): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}
function ranked(array $rows): array {
    usort($rows, fn($a,$b)=>($b['palabrasResueltas'] <=> $a['palabrasResueltas']) ?: strcmp($a['fecha'],$b['fecha']) ?: strcmp($a['id'],$b['id']));
    foreach ($rows as $i=>&$row) $row['posicion']=$i+1;
    unset($row); return $rows;
}
$method=$_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method,['GET','POST'],true)) { header('Allow: GET, POST'); reply(405,['error'=>'Método no permitido.']); }
$record=null;
if ($method==='POST') {
    $type=strtolower(trim(explode(';',$_SERVER['CONTENT_TYPE'] ?? '')[0]));
    if ($type!=='application/json') reply(415,['error'=>'Formato no válido.']);
    $raw=file_get_contents('php://input',false,null,0,4097);
    if ($raw===false || strlen($raw)>4096) reply(413,['error'=>'Solicitud demasiado grande.']);
    try { $data=json_decode($raw,false,512,JSON_THROW_ON_ERROR); }
    catch (JsonException $error) { reply(400,['error'=>'Datos no válidos.']); }
    if (!is_object($data) || !is_string($data->token ?? null)) reply(403,['error'=>'Solo se admiten partidas online verificadas.']);
    $run=gameRun($data->token);
    $record=['id'=>$run['id'],'nombre'=>$run['nombre'],'palabrasResueltas'=>$run['score'],'fecha'=>$run['fecha']??gmdate('Y-m-d\TH:i:s\Z'),'verificada'=>true];
    $_SESSION['run']['ended']=true;
    $_SESSION['run']['fecha']=$record['fecha'];
}
$directory=__DIR__.'/datos'; $file=$directory.'/ranking.json'; $lock=null; $temp=null;
try {
    $lock=fopen($directory.'/ranking.lock','c');
    if (!$lock || !flock($lock,$method==='POST'?LOCK_EX:LOCK_SH)) throw new RuntimeException('No se puede bloquear.');
    $raw=file_get_contents($file);
    if ($raw===false) throw new RuntimeException('Falta ranking.json.');
    $rows=json_decode($raw,true,512,JSON_THROW_ON_ERROR);
    if (!is_array($rows) || array_values($rows)!==$rows || !str_starts_with(ltrim($raw),'[')) throw new RuntimeException('Ranking no válido.');
    $status=200;
    if ($method==='POST') {
        $existing=null;
        foreach ($rows as $row) if ($row['id']===$record['id']) { $existing=$row; break; }
        if ($existing) {
            if ($existing['nombre']!==$record['nombre'] || $existing['palabrasResueltas']!==$record['palabrasResueltas']) {
                flock($lock,LOCK_UN); fclose($lock); $lock=null;
                reply(409,['error'=>'La partida ya se ha guardado con otros datos.']);
            }
            $record=$existing;
        } else {
            $rows[]=$record;
            $json=json_encode($rows,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
            $temp=tempnam($directory,'ranking_');
            if ($temp===false || file_put_contents($temp,$json)!==strlen($json) || !rename($temp,$file)) throw new RuntimeException('No se puede guardar.');
            $temp=null; $status=201;
        }
        $ranking=ranked($rows); $position=null;
        foreach ($ranking as $row) if ($row['id']===$record['id']) { $position=$row['posicion']; break; }
        $result=['mensaje'=>'Puntuación guardada correctamente.','partida'=>$record,'posicion'=>$position,'ranking'=>array_slice($ranking,0,5)];
    } else $result=array_slice(ranked($rows),0,5);
} catch (Throwable $error) {
    error_log('Ranking ahorcado: '.$error->getMessage()); $status=500; $result=['error'=>'No se ha podido procesar el ranking.'];
} finally {
    if (is_string($temp) && is_file($temp)) unlink($temp);
    if (is_resource($lock)) { flock($lock,LOCK_UN); fclose($lock); }
}
reply($status,$result);
