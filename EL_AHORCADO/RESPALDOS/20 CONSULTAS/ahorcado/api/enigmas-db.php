<?php
declare(strict_types=1);
function enigmasDb(): PDO {
 static $db=null;if($db)return $db;
 if(!extension_loaded('pdo_sqlite'))throw new RuntimeException('Falta PDO SQLite.');
 $db=new PDO('sqlite:'.__DIR__.'/datos/enigmas.sqlite',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
 $db->exec('PRAGMA busy_timeout=5000');$db->exec('PRAGMA journal_mode=WAL');
 $db->exec('CREATE TABLE IF NOT EXISTS enigmas (id TEXT PRIMARY KEY,category TEXT NOT NULL,level TEXT NOT NULL,payload TEXT NOT NULL); CREATE INDEX IF NOT EXISTS enigmas_filters ON enigmas(category,level); CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY,value TEXT NOT NULL); CREATE TABLE IF NOT EXISTS enigma_entities (entity_id TEXT PRIMARY KEY,enigma_id TEXT NOT NULL)');
 return $db;
}
function enigmasMeta(string $key,mixed $default=null): mixed {
 $q=enigmasDb()->prepare('SELECT value FROM metadata WHERE key=?');$q->execute([$key]);$v=$q->fetchColumn();return $v===false?$default:json_decode($v,true,512,JSON_THROW_ON_ERROR);
}
function enigmasSetMeta(string $key,mixed $value): void {
 $q=enigmasDb()->prepare('INSERT INTO metadata(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value');$q->execute([$key,json_encode($value,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR)]);
}
function enigmasSave(array $entries): void {
 $db=enigmasDb();$owned=!$db->inTransaction();if($owned)$db->beginTransaction();
 try {
  $q=$db->prepare('INSERT INTO enigmas(id,category,level,payload) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET category=excluded.category,level=excluded.level,payload=excluded.payload');
  $findEntity=$db->prepare('SELECT e.id,e.payload FROM enigma_entities m JOIN enigmas e ON e.id=m.enigma_id WHERE m.entity_id=?');
  $findText=$db->prepare('SELECT id,payload FROM enigmas WHERE id=?');
  $mapEntity=$db->prepare('INSERT INTO enigma_entities(entity_id,enigma_id) VALUES(?,?) ON CONFLICT(entity_id) DO UPDATE SET enigma_id=excluded.enigma_id');
  foreach($entries as $e) {
   $len=preg_match_all('/./us',$e['text']);
   if($len<3||$len>65||preg_match('/[^A-ZÁÉÍÓÚÜÑ \-–—\x{2019}\x{0027}.,:!?¡¿]/u',$e['text']))continue;
   $entity=is_string($e['entityId']??null)&&preg_match('/^Q[1-9][0-9]*$/D',$e['entityId'])?$e['entityId']:null;
   $existing=false;
   if($entity){$findEntity->execute([$entity]);$existing=$findEntity->fetch();}
   if(!$existing){$findText->execute([$e['id']]);$existing=$findText->fetch();}
   if($existing) {
    $old=json_decode($existing['payload'],true,512,JSON_THROW_ON_ERROR);
    $oldSpanish=($old['sourceLanguage']??'')==='es'||str_starts_with($old['sourceUrl']??'','https://es.wikipedia.org/');
    // No reemplazar una respuesta española por su título inglés.
    if($oldSpanish&&($e['sourceLanguage']??'es')==='en') {
     if($entity)$mapEntity->execute([$entity,$existing['id']]);
     continue;
    }
    // Mantener el id usado por las partidas abiertas aunque mejore el título.
    $e['id']=$existing['id'];
   }
   $q->execute([$e['id'],$e['category'],$e['level'],json_encode($e,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR)]);
   if($entity)$mapEntity->execute([$entity,$e['id']]);
  }
  enigmasSetMeta('updatedAt',gmdate('c'));if($owned)$db->commit();
 }catch(Throwable $e){if($owned&&$db->inTransaction())$db->rollBack();throw $e;}
}
function enigmasSelect(string $category,string $level,array $seen,int $limit=1): array {
 $where=[];$args=[];
 if($category!=='all'){$where[]='category=?';$args[]=$category;}
 if($level!=='all'){$where[]='level=?';$args[]=$level;}
 $q=enigmasDb()->prepare('SELECT id,payload FROM enigmas'.($where?' WHERE '.implode(' AND ',$where):'').' ORDER BY random()');$q->execute($args);$out=[];
 while($r=$q->fetch()){if(isset($seen[$r['id']]))continue;$out[]=json_decode($r['payload'],true,512,JSON_THROW_ON_ERROR);if(count($out)>=$limit)break;}
 return $out;
}
