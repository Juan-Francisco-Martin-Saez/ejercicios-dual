<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require_once __DIR__.'/enigmas-db.php';
function enigmasDailyBackup(): string {
 $dir=__DIR__.'/datos/respaldos';
 if(!is_dir($dir)&&!mkdir($dir,0700,true)&&!is_dir($dir))throw new RuntimeException('No se puede crear la carpeta de respaldos.');
 $path=$dir.'/enigmas-'.gmdate('Y-m-d').'.sqlite';
 if(is_file($path))return $path;
 $lock=fopen($dir.'/.respaldo.lock','c');
 if(!$lock)throw new RuntimeException('No se puede bloquear el respaldo.');
 $temp=null;
 try {
  if(!flock($lock,LOCK_EX|LOCK_NB))return '';
  if(is_file($path))return $path;
  $temp=$dir.'/.enigmas-'.bin2hex(random_bytes(8)).'.sqlite';
  enigmasDb()->exec('VACUUM INTO '.enigmasDb()->quote($temp));
  $check=new PDO('sqlite:'.$temp,null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
  if($check->query('PRAGMA integrity_check')->fetchColumn()!=='ok')throw new RuntimeException('El respaldo no supera la integridad.');
  $check=null;
  chmod($temp,0600);
  if(!rename($temp,$path))throw new RuntimeException('No se puede guardar el respaldo.');
  $temp=null;
  $files=glob($dir.'/enigmas-????-??-??.sqlite')?:[];rsort($files,SORT_STRING);
  foreach(array_slice($files,7) as $old)if(!unlink($old))error_log('No se ha podido retirar un respaldo antiguo.');
  return $path;
 } finally {
  if($temp!==null&&is_file($temp))unlink($temp);
  flock($lock,LOCK_UN);fclose($lock);
 }
}
if(!defined('AHORCADO_BACKUP_LIBRARY')) {
 try {$path=enigmasDailyBackup();echo $path!==''?"Respaldo diario disponible: {$path}\n":"Otro respaldo está en curso.\n";}
 catch(Throwable $error){fwrite(STDERR,'Respaldo no completado: '.$error->getMessage()."\n");exit(1);}
}
