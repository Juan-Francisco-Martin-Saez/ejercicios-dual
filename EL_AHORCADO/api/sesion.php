<?php
declare(strict_types=1);
// Archivo interno: incluir desde las API, nunca recibe acciones del jugador.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Cross-Origin-Resource-Policy: same-origin');
ini_set('display_errors','0');
function gameReply(int $code,array $data): never {
    http_response_code($code); echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR); exit;
}
if (($_SERVER['HTTP_SEC_FETCH_SITE']??'')==='cross-site') gameReply(403,['error'=>'Solicitud no permitida.']);
$sessionDir=__DIR__.'/datos/sesiones';
if (!is_dir($sessionDir) && !mkdir($sessionDir,0700,true) && !is_dir($sessionDir)) gameReply(503,['error'=>'No se puede iniciar la partida.']);
ini_set('session.use_strict_mode','1'); ini_set('session.use_only_cookies','1'); ini_set('session.gc_maxlifetime','86400');
session_save_path($sessionDir); session_name('AHORCADO_VERIFICADO');
session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off','httponly'=>true,'samesite'=>'Strict']);
if (!session_start()) gameReply(503,['error'=>'No se puede iniciar la partida.']);
function gameInput(): array {
    if (($_SERVER['REQUEST_METHOD']??'GET')!=='POST') { header('Allow: POST');gameReply(405,['error'=>'Método no permitido.']); }
    if (strtolower(trim(explode(';',$_SERVER['CONTENT_TYPE']??'')[0]))!=='application/json') gameReply(415,['error'=>'Formato no válido.']);
    $raw=file_get_contents('php://input',false,null,0,4097);
    if ($raw===false || strlen($raw)>4096) gameReply(413,['error'=>'Solicitud demasiado grande.']);
    try {$data=json_decode($raw,true,32,JSON_THROW_ON_ERROR);}catch(Throwable $e){gameReply(400,['error'=>'Datos no válidos.']);}
    if (!is_array($data)) gameReply(400,['error'=>'Datos no válidos.']);return $data;
}
function gameRun(string $token): array {
    $run=$_SESSION['run']??null;
    if (!$run || !hash_equals($run['token'],$token) || time()-$run['created']>86400) gameReply(409,['error'=>'La partida ha caducado. Inicia una nueva.']);
    return $run;
}
