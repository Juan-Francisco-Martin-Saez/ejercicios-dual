<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(403);exit;}
require __DIR__.'/enigmas-db.php';
function comprobarOrigen(PDO $db,PDO $input): void {
 $expected=$input->query('SELECT id,payload_sha256 FROM originales')->fetchAll(PDO::FETCH_KEY_PAIR);
 $actual=$db->query('SELECT id,payload FROM enigmas')->fetchAll(PDO::FETCH_KEY_PAIR);
 if(count($actual)!==count($expected))throw new RuntimeException('La base ha cambiado desde el respaldo de 919 entradas. No se ha importado.');
 foreach($expected as $id=>$hash)if(!isset($actual[$id])||hash('sha256',$actual[$id])!==$hash)throw new RuntimeException('Entrada modificada desde el respaldo: '.$id.'. No se ha importado.');
}
try {
 $path=__DIR__.'/datos/ampliacion-3000.sqlite';
 if(!is_file($path))throw new RuntimeException('Falta api/datos/ampliacion-3000.sqlite.');
 if(!is_file(__DIR__.'/datos/enigmas.sqlite'))throw new RuntimeException('Falta la base del juego; no se creará una vacía.');
 $input=new PDO('sqlite:'.$path,null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
 $input->exec('PRAGMA query_only=ON');
 if($input->query('PRAGMA integrity_check')->fetchColumn()!=='ok')throw new RuntimeException('Ampliación dañada.');
 $info=$input->query('SELECT key,value FROM info')->fetchAll(PDO::FETCH_KEY_PAIR);
 if(($info['version']??'')!=='editorial-balanced-v1')throw new RuntimeException('Versión de ampliación incorrecta.');
 $rows=$input->query('SELECT * FROM catalogo_revisado')->fetchAll();
 if(count($rows)!==3000)throw new RuntimeException('El catálogo debe contener 3000 entradas.');
 $bins=[];$levels=[];$keys=[];
 foreach($rows as $row){
  $e=json_decode($row['payload'],true,512,JSON_THROW_ON_ERROR);
  if($e['id']!==$row['id']||$e['category']!==$row['category']||$e['level']!==$row['level'])throw new RuntimeException('Payload incoherente.');
  $len=preg_match_all('/./us',$e['text']);
  if($len<3||$len>65||preg_match('/[^A-ZÁÉÍÓÚÜÑ \-–—\x{2019}\x{0027}.,:!?¡¿]/u',$e['text']))throw new RuntimeException('Respuesta no admitida: '.$e['text']);
  $key=preg_replace('/[^A-ZÑ ]/u',' ',strtr($e['text'],['Á'=>'A','É'=>'E','Í'=>'I','Ó'=>'O','Ú'=>'U','Ü'=>'U']));
  $key=trim(preg_replace('/\s+/u',' ',$key));
  if(isset($keys[$key]))throw new RuntimeException('Respuesta repetida: '.$key);$keys[$key]=true;
  $bins[$e['category']][$e['level']]=($bins[$e['category']][$e['level']]??0)+1;
  $levels[$e['level']]=($levels[$e['level']]??0)+1;
 }
 if(count($bins)!==16||count($levels)!==4)throw new RuntimeException('Reparto incorrecto.');
 foreach(['easy','medium','hard','expert'] as $level)if(($levels[$level]??0)!==750)throw new RuntimeException('Nivel desequilibrado.');
 foreach($bins as $bin){if(count($bin)!==4||min($bin)<46||max($bin)>47||!in_array(array_sum($bin),[187,188],true))throw new RuntimeException('Categoría desequilibrada.');}
 $db=enigmasDb();
 if(enigmasMeta('catalogoEditorialImportado',null)){
  echo 'Esta ampliación ya está aplicada. Total actual: '.$db->query('SELECT count(*) FROM enigmas')->fetchColumn()."\n";exit(0);
 }
 comprobarOrigen($db,$input);
 $dir=__DIR__.'/datos/respaldos';if(!is_dir($dir)&&!mkdir($dir,0700,true))throw new RuntimeException('No se pudo crear la carpeta de respaldos.');
 file_put_contents($dir.'/.htaccess',"Require all denied\n");
 $backup=$dir.'/enigmas-antes-3000-'.gmdate('Ymd-His').'-'.bin2hex(random_bytes(3)).'.sqlite';
 $db->exec('VACUUM INTO '.$db->quote($backup));chmod($backup,0600);
 $check=new PDO('sqlite:'.$backup);if($check->query('PRAGMA integrity_check')->fetchColumn()!=='ok')throw new RuntimeException('Respaldo inválido; importación cancelada.');$check=null;
 $db->beginTransaction();
 comprobarOrigen($db,$input);
 $db->exec('CREATE TABLE IF NOT EXISTS enigmas_retirados(id TEXT PRIMARY KEY,payload TEXT NOT NULL,motivo TEXT NOT NULL,retired_at TEXT NOT NULL)');
 $archive=$db->prepare('INSERT OR REPLACE INTO enigmas_retirados VALUES(?,?,?,?)');
 $remove=$db->prepare('DELETE FROM enigmas WHERE id=?');
 $finalIds=array_column($rows,'id');
 $old=$db->query('SELECT id,payload FROM enigmas')->fetchAll(PDO::FETCH_KEY_PAIR);$retired=0;$newCount=count(array_diff($finalIds,array_keys($old)));
 $map=$db->prepare('UPDATE enigma_entities SET enigma_id=? WHERE enigma_id=?');
 foreach($input->query('SELECT * FROM remapeo') as $r){
  if($r['id_final']!==null){if($r['id_final']!==$r['id_original']){$map->execute([$r['id_final'],$r['id_original']]);$archive->execute([$r['id_original'],$old[$r['id_original']],$r['motivo'],gmdate('c')]);$remove->execute([$r['id_original']]);$retired++;}}
  else {$archive->execute([$r['id_original'],$old[$r['id_original']],$r['motivo'],gmdate('c')]);$remove->execute([$r['id_original']]);$retired++;}
 }
 $save=$db->prepare('INSERT INTO enigmas(id,category,level,payload) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET category=excluded.category,level=excluded.level,payload=excluded.payload');
 foreach($rows as $r)$save->execute([$r['id'],$r['category'],$r['level'],$r['payload']]);
 $alias=$db->prepare('INSERT INTO enigma_aliases(alias,enigma_id) VALUES(?,?) ON CONFLICT(alias) DO UPDATE SET enigma_id=excluded.enigma_id');
 foreach($input->query('SELECT * FROM aliases') as $r)$alias->execute([$r['alias'],$r['enigma_id']]);
 $db->exec('DELETE FROM enigma_entities WHERE enigma_id NOT IN (SELECT id FROM enigmas);DELETE FROM enigma_aliases WHERE enigma_id NOT IN (SELECT id FROM enigmas)');
 enigmasSetMeta('updatedAt',gmdate('c'));enigmasSetMeta('month',gmdate('Y-m'));
 enigmasSetMeta('progress',['month'=>gmdate('Y-m'),'baseCount'=>3000,'target'=>3750,'turn'=>0]);
 enigmasSetMeta('retry',['retryAt'=>0,'updatedAt'=>gmdate('c'),'failures'=>0]);
 enigmasSetMeta('catalogoEditorialImportado',['version'=>'editorial-balanced-v1','at'=>gmdate('c'),'count'=>3000]);
 if((int)$db->query('SELECT count(*) FROM enigmas')->fetchColumn()!==3000||$db->query('PRAGMA integrity_check')->fetchColumn()!=='ok')throw new RuntimeException('Verificación final fallida.');
 $db->commit();
 echo "Importación completada: 3000 enigmas.\nAñadidos: $newCount. Archivados: $retired.\n750 por dificultad; 187 o 188 por categoría.\nRespaldo previo: $backup\n";
}catch(Throwable $e){if(isset($db)&&$db->inTransaction())$db->rollBack();fwrite(STDERR,'ERROR: '.$e->getMessage()."\n");exit(1);}
