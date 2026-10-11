<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
define('AHORCADO_WORDS_LIBRARY',true);
require __DIR__.'/palabras.php';
define('AHORCADO_BACKUP_LIBRARY',true);
require __DIR__.'/respaldar-enigmas.php';
// Primer lote editorial. Las dificultades son estimaciones editoriales, no métricas de visitas.
// Fuente de los planetas: anexo de Wikipedia; las otras tres entradas tienen artículo propio.
$planetSource='https://es.wikipedia.org/wiki/Anexo:Planetas_y_sat%C3%A9lites_de_Star_Wars';
$groups=[
 'medium'=>['Tatooine','Coruscant','Naboo','Hoth','Endor','Alderaan','Mustafar'],
 'hard'=>['Bespin','Kashyyyk','Kamino','Jakku','Mandalore','Yavin','Geonosis','Corellia'],
 'expert'=>['Kessel','Utapau','Hosnian Prime','Ahch-To','Exegol']
];
$rows=[];
foreach($groups as $level=>$titles)foreach($titles as $title)$rows[]=[$title,$level,$planetSource];
$rows[]=['Mordor','medium','https://es.wikipedia.org/wiki/Mordor'];
$rows[]=['Rivendel','medium','https://es.wikipedia.org/wiki/Rivendel'];
$rows[]=['Tierra Media','medium','https://es.wikipedia.org/wiki/Tierra_Media'];
try {
 enigmasDailyBackup();
 $db=enigmasDb();$before=(int)$db->query('SELECT count(*) FROM enigmas')->fetchColumn();
 $entries=[];
 $db->beginTransaction();
 $exists=$db->prepare('SELECT 1 FROM enigmas WHERE id=?');
 foreach($rows as [$title,$level,$url]) {
  $text=wordsUpper($title);$id=wordsKey($text);
  $exists->execute([$id]);if($exists->fetchColumn())continue;
  $entries[]=['id'=>$id,'text'=>$text,'category'=>'Cultura friki','level'=>$level,
   'source'=>'manual','sourceLanguage'=>'es','sourceUrl'=>$url,'recognitionPolicy'=>WORD_POLICY,
   'evidence'=>['method'=>'revision-editorial','difficultyMethod'=>'editorial','checkedAt'=>gmdate('c')]];
 }
 if($entries)wordsRemember($entries);
 $after=(int)$db->query('SELECT count(*) FROM enigmas')->fetchColumn();
 if($db->query('PRAGMA integrity_check')->fetchColumn()!=='ok')throw new RuntimeException('Integridad no válida.');
 $db->commit();
 echo 'Añadidos: '.($after-$before).' · Total: '.$after.PHP_EOL;
 foreach($db->query('SELECT category,count(*) AS n FROM enigmas GROUP BY category ORDER BY n') as $row)echo $row['category'].': '.$row['n'].PHP_EOL;
} catch(Throwable $error) {
 if(isset($db)&&$db->inTransaction())$db->rollBack();
 fwrite(STDERR,'Importación cancelada: '.$error->getMessage().PHP_EOL);exit(1);
}
