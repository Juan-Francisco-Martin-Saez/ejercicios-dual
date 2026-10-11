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
// Dos rondas en español por cada ronda en inglés; hasta 20 candidatos por lote.
const WORD_BATCH = 20;
const WORD_EN_TOPICS = [
 ['Adventure films','Science fiction films','Drama films','Comedy films','Horror films'],
 ['Comedy television series','Drama television series','Science fiction television series','Fantasy television series'],
 ['Disney animated films','Pixar films','Studio Ghibli films','Animated films'],
 ['Animated television series','Anime television series','American animated television series'],
 ['Game shows','Spanish television shows','Talk shows','Reality television series'],
 ['Platform games','Role-playing video games','Action games','Adventure games'],
 ['Adventure novels','Science fiction novels','Fantasy novels','Crime novels','Literary works'],
 ['Spanish singers','American singers','Rock music groups','Pop music groups','Mexican singers'],
 ['Rock songs','Pop songs','Spanish-language songs','English-language songs'],
 ['Monuments and memorials in Spain','World Heritage Sites','Cities','Mountains','Rivers'],
 ['Scientists','Explorers','Emperors','Presidents','Philosophers'],
 ['Comics characters','Video game characters','Literary characters','Superheroes'],
 ['Rice dishes','Spanish cuisine','Desserts','Italian cuisine','Mexican cuisine'],
 ['Paintings','Sculptures','Painters','Sculptors','Art movements'],
 ['Sports','Association football players','Tennis players','Basketball players','Sports competitions'],
 ['Fictional objects','Star Wars technology','Middle-earth locations','Fictional vehicles','Fictional universes']
];
function wordsReply(int $status,array $data): never {
 http_response_code($status); echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR); exit;
}
function wordsUpper(string $text): string { return strtoupper(strtr($text,['á'=>'Á','é'=>'É','í'=>'Í','ó'=>'Ó','ú'=>'Ú','ü'=>'Ü','ñ'=>'Ñ'])); }
function wordsKey(string $text): string {
 return trim(preg_replace('/\s+/u',' ',preg_replace('/[^A-ZÑ ]/u',' ',strtr(wordsUpper($text),['Á'=>'A','É'=>'E','Í'=>'I','Ó'=>'O','Ú'=>'U','Ü'=>'U']))));
}
require __DIR__.'/enigmas-db.php';
function wordsHttp(array $params,int $timeout=20,string $language='es'): array {
 if(!in_array($language,['es','en'],true))throw new InvalidArgumentException('Fuente no permitida.');
 if(defined('AHORCADO_BACKGROUND_SYNC')&&AHORCADO_BACKGROUND_SYNC) {
  static $lastRequest=0.0;
  $wait=1.0-(microtime(true)-$lastRequest);
  if($wait>0)usleep((int)ceil($wait*1000000));
  $lastRequest=microtime(true);
 }
 if(!function_exists('curl_init'))throw new RuntimeException('Falta cURL.');
 $curl=curl_init('https://'.$language.'.wikipedia.org/w/api.php?'.http_build_query($params+['format'=>'json','formatversion'=>2,'maxlag'=>5]));
 curl_setopt_array($curl,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>min(10,$timeout),CURLOPT_TIMEOUT=>$timeout,
  CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_USERAGENT=>'ReijohanAhorcado/5.1 (cultural word game)']);
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
// Clasificación inglesa independiente: introducción y categorías deben coincidir.
function wordsCategoryEnglish(array $page): ?string {
 $intro=wordsKey(mbSafeSlice((string)($page['extract']??''),650));
 $cats=wordsKey(implode(' ',array_column($page['categories']??[],'title')));
 $has=fn(string $p)=>preg_match('~'.$p.'~u',$intro)===1;
 $cat=fn(string $p)=>preg_match('~'.$p.'~u',$cats)===1;
 if(!$has('\b(IS|WAS|ARE|WERE)\b'))return null;
 if($has('\b(FILM|MOVIE)\b')&&$cat('\bFILMS\b'))return ($has('\b(ANIMATED|ANIMATION|ANIME)\b')&&$cat('ANIMATED|ANIME|PIXAR|STUDIO GHIBLI'))?'Películas de animación':'Películas';
 if($has('TELEVISION (SHOW|PROGRAM|PROGRAMME)|GAME SHOW|TALK SHOW|REALITY TELEVISION')&&$cat('TELEVISION SHOWS|TELEVISION PROGRAM|GAME SHOWS|TALK SHOWS|REALITY TELEVISION'))return 'Programas de televisión';
 if($has('\b(TELEVISION|TV|ANIME|ANIMATED)\b.*\bSERIES\b')&&$cat('TELEVISION SERIES|ANIME.*SERIES'))return ($cat('ANIMATED TELEVISION|ANIME')&&$has('ANIMATED|ANIMATION|ANIME'))?'Series de animación':'Series de ficción';
 if($has('\bVIDEO GAME\b')&&$cat('VIDEO GAMES'))return 'Videojuegos';
 if($has('\b(NOVEL|BOOK|PLAY|POETRY COLLECTION)\b')&&$cat('NOVELS|BOOKS|PLAYS|POETRY COLLECTIONS'))return 'Libros';
 if($has('\b(SONG|SINGLE)\b')&&$cat('\b(SONGS|SINGLES)\b'))return 'Canciones';
 if($has('\b(SINGER|BAND|MUSICAL GROUP|ROCK GROUP|POP GROUP)\b')&&$cat('SINGERS|MUSICAL GROUPS|ROCK GROUPS|POP GROUPS'))return 'Cantantes y grupos';
 if($has('FICTIONAL CHARACTER|SUPERHERO|SUPERVILLAIN')&&$cat('CHARACTERS|SUPERHEROES|SUPERVILLAINS'))return 'Personajes de ficción';
 if($has('\b(DISH|DESSERT|FOOD|DRINK|BEVERAGE|SAUCE|SOUP|PASTA|CHEESE|BREAD|PASTRY)\b')&&$cat('CUISINE|DISHES|DESSERTS|FOODS|BEVERAGES|CHEESES|BREADS|SAUCES|PASTRIES'))return 'Gastronomía';
 if($has('\b(PAINTER|SCULPTOR|PAINTING|SCULPTURE|ART MOVEMENT)\b')&&$cat('PAINTERS|SCULPTORS|PAINTINGS|SCULPTURES|ART MOVEMENTS'))return 'Arte';
 if($has('\b(SPORT|FOOTBALLER|FOOTBALL PLAYER|TENNIS PLAYER|BASKETBALL PLAYER|ATHLETE|RACING DRIVER|TOURNAMENT|CHAMPIONSHIP|FOOTBALL CLUB)\b')&&$cat('SPORTS|FOOTBALL|TENNIS|BASKETBALL|ATHLETES|RACING DRIVERS|TOURNAMENTS|CHAMPIONSHIPS'))return 'Deportes';
 if($has('\b(CITY|TOWN|MUNICIPALITY|CAPITAL|MONUMENT|TOWER|CATHEDRAL|PALACE|TEMPLE|MOUNTAIN|RIVER|ISLAND|LAKE|DESERT)\b')&&$cat('CITIES|TOWNS|MUNICIPALITIES|MONUMENTS|HERITAGE|TOWERS|CATHEDRALS|PALACES|TEMPLES|MOUNTAINS|RIVERS|ISLANDS|LAKES|DESERTS'))return 'Lugares y monumentos';
 if($has('\b(SCIENTIST|PHYSICIST|PHILOSOPHER|EMPEROR|EMPRESS|PRESIDENT|POLITICIAN|EXPLORER|KING|QUEEN|INVENTOR)\b')&&$cat('SCIENTISTS|PHYSICISTS|PHILOSOPHERS|EMPERORS|EMPRESSES|PRESIDENTS|POLITICIANS|EXPLORERS|MONARCHS|KINGS|QUEENS|INVENTORS'))return 'Figuras históricas y públicas';
 if($has('FICTIONAL')&&$has('OBJECT|WEAPON|VEHICLE|SPACECRAFT|PLANET|UNIVERSE|WORLD|LOCATION')&&$cat('FICTIONAL OBJECTS|FICTIONAL VEHICLES|FICTIONAL UNIVERSES|STAR WARS|MIDDLE EARTH'))return 'Cultura friki';
 return null;
}
function mbSafeSlice(string $s,int $limit): string {return implode('',array_slice(preg_split('//u',$s,-1,PREG_SPLIT_NO_EMPTY)?:[],0,$limit));}
function wordsItem(array $page,string $category,string $language='es'): ?array {
 if(($page['ns']??-1)!==0||isset($page['missing'])||isset($page['pageprops']['disambiguation'])||($language==='es'?wordsCategory($page):wordsCategoryEnglish($page))!==$category)return null;
 $title=(string)($page['title']??'');
 if(preg_match('/^(Anexo:|Lista de|Historia de|Temporada|Episodio|Discografía|List of|History of|Season|Episode|Discography)/iu',$title))return null;
 // Quitar únicamente el desambiguador; los números y signos incompatibles con el teclado se descartan.
 $text=wordsUpper(trim(preg_replace('/\s*\([^()]*\)$/u','',$title)));
 $length=preg_match_all('/./us',$text);
 if($length<3||$length>65||preg_match('/[^A-ZÁÉÍÓÚÜÑ \-–—\x{2019}\x{0027}.,:!?¡¿]/u',$text))return null;
 $views=array_values(array_filter($page['pageviews']??[],fn($v)=>is_numeric($v)&&$v>=0));
 if(count($views)<14)return null; // Sin evidencia suficiente, no adivinar el reconocimiento.
 sort($views); $median=(float)$views[intdiv(count($views),2)];
 $languages=count(array_unique(array_column($page['langlinks']??[],'lang')));
 // Indicadores aproximados, NO garantía editorial de que todos conozcan la respuesta.
 // Mediana mensual evita que una noticia puntual convierta algo desconocido en nivel fácil.
 if($median<20||$languages<8)return null;
 $level=(($median>=500&&$languages>=30)||($median>=80&&$languages>=55))?'easy':($median>=50&&$languages>=25?'medium':($median>=25&&$languages>=15?'hard':'expert'));
 return ['id'=>wordsKey($text),'text'=>$text,'category'=>$category,'level'=>$level,'source'=>'internet',
  'sourceLanguage'=>$language,'entityId'=>$page['pageprops']['wikibase_item']??null,
  'sourceUrl'=>'https://'.$language.'.wikipedia.org/?curid='.(int)$page['pageid'],'recognitionPolicy'=>WORD_POLICY,
  'evidence'=>['medianDailyViews'=>$median,'languages'=>$languages,'checkedAt'=>gmdate('c')]];
}
// Metadatos completos por lote; respetar las continuaciones y el plazo total.
function wordsPages(array $selector,string $language,float $deadline): array {
 $params=$selector+['action'=>'query','redirects'=>1,
  'prop'=>'pageprops|categories|extracts|langlinks|pageviews','ppprop'=>'disambiguation|wikibase_item',
  'clshow'=>'!hidden','cllimit'=>'max','exintro'=>1,'explaintext'=>1,'exlimit'=>20,'lllimit'=>'max','pvipdays'=>30];
 $pages=[];$continuation=[];
 for($i=0;$i<24;$i++) {
  $remaining=(int)floor($deadline-microtime(true));
  if($remaining<1)throw new RuntimeException('Tiempo de consulta agotado.');
  $data=wordsHttp($params+$continuation,min(20,$remaining),$language);
  foreach($data['query']['pages']??[] as $page) {
   $id=$page['pageid']??($page['title']??'');$previous=$pages[$id]??[];
   foreach(['categories','langlinks'] as $field)if(isset($previous[$field]))$page[$field]=array_merge($previous[$field],$page[$field]??[]);
   $page['pageprops']=array_replace($previous['pageprops']??[],$page['pageprops']??[]);
   $pages[$id]=array_replace($previous,$page);
  }
  $continuation=$data['continue']??[];if(!$continuation)break;
 }
 if($continuation)throw new RuntimeException('Metadatos incompletos; se descarta el lote.');
 return array_values($pages);
}
function wikiSearch(int $source,int $offset,int $limit,string $level='all',string $language='es'): array {
 $deadline=microtime(true)+90;
 if(!isset(WORD_SOURCES[$source])||!in_array($level,array_merge(['all'],WORD_LEVELS),true)||!in_array($language,['es','en'],true))throw new InvalidArgumentException('Filtro no válido.');
 $topics=$language==='es'?WORD_SOURCES[$source][1]:WORD_EN_TOPICS[$source];
 $topic=$topics[random_int(0,count($topics)-1)];
 // Recorrer las páginas de cada tema en lugar de repetir offsets aleatorios.
 $cursorKey='search-cursor:'.$language.':'.hash('sha256',$topic);
 $background=defined('AHORCADO_BACKGROUND_SYNC')&&AHORCADO_BACKGROUND_SYNC;
 $offset=$background?(int)enigmasMeta($cursorKey,0):max(0,min(1000,$offset));
 $params=['action'=>'query','list'=>'search','srnamespace'=>0,'srlimit'=>min(20,max(1,$limit)),
  'sroffset'=>$offset,'srsort'=>'incoming_links_desc','srprop'=>'','srinfo'=>'totalhits'];
 try {$search=wordsHttp($params+['srsearch'=>'deepcat:"'.$topic.'"'],20,$language);}
 catch(RuntimeException $e) {
  if(!str_contains($e->getMessage(),'cirrussearch'))throw $e;
  $search=wordsHttp($params+['srsearch'=>'incategory:"'.$topic.'"'],20,$language);
 }
 $next=$search['continue']['sroffset']??null;
 $hits=$search['query']['search']??[];
 if(!$hits){if($background)enigmasSetMeta($cursorKey,0);return ['entries'=>[],'next'=>null,'total'=>$search['query']['searchinfo']['totalhits']??0];}
 $pages=wordsPages(['pageids'=>implode('|',array_column($hits,'pageid'))],$language,$deadline);
 $category=WORD_SOURCES[$source][0];$entries=[];$spanishTitles=[];
 foreach($pages as $page) {
  if($language==='en') {
   $spanish=null;
   foreach($page['langlinks']??[] as $link)if(($link['lang']??'')==='es'){$spanish=$link['title']??$link['*']??null;break;}
   // Si hay artículo español, validarlo en español; no aceptar el inglés como atajo.
   if($spanish){$spanishTitles[$spanish]=true;continue;}
  }
  $item=wordsItem($page,$category,$language);
  if($item&&($level==='all'||$item['level']===$level))$entries[$item['id']]=$item;
 }
 if($spanishTitles) {
  $translated=wordsPages(['titles'=>implode('|',array_keys($spanishTitles))],'es',$deadline);
  foreach($translated as $page) {
   $item=wordsItem($page,$category,'es');
   if($item&&($level==='all'||$item['level']===$level))$entries[$item['id']]=$item;
  }
 }
 $entries=array_values($entries);shuffle($entries);wordsRemember($entries);
 // Avanzar solo tras guardar: un fallo no pierde el lote pendiente.
 if($background)enigmasSetMeta($cursorKey,$next!==null&&$next<=1000?(int)$next:0);
 error_log('Lote Wikipedia '.$language.': '.count($hits).' candidatos, '.count($entries).' válidos.');
 return ['entries'=>$entries,'next'=>$next,'total'=>$search['query']['searchinfo']['totalhits']??count($hits)];
}
function wordsQualified(array $entries): array {
 $unique=[];
 foreach($entries as $entry)if(is_array($entry)&&($entry['recognitionPolicy']??'')===WORD_POLICY&&isset($entry['text'],$entry['category'],$entry['level'])
  &&in_array($entry['category'],array_column(WORD_SOURCES,0),true)&&in_array($entry['level'],WORD_LEVELS,true)) {
  $entry['id']=wordsKey($entry['text']); if($entry['id']!=='')$unique[$entry['id']]=$entry;
 }
 return array_values($unique);
}
function wordsRemember(array $entries): void { enigmasSave(wordsQualified($entries)); }
function wordsCatalog(): array {
 $db=enigmasDb(); $entries=array_map(fn($r)=>json_decode($r['payload'],true,512,JSON_THROW_ON_ERROR),$db->query('SELECT payload FROM enigmas ORDER BY id')->fetchAll());
 $month=enigmasMeta('month','');
 return ['version'=>5,'month'=>$month,'updatedAt'=>enigmasMeta('updatedAt',null),'count'=>count($entries),'target'=>WORD_TARGET,'recognitionPolicy'=>WORD_POLICY,'entries'=>$entries,'stale'=>$month!==gmdate('Y-m')];
}
function wordsSync(): array {
 $month=gmdate('Y-m');$db=enigmasDb();$count=(int)$db->query('SELECT count(*) FROM enigmas')->fetchColumn();
 $state=enigmasMeta('progress',null);
 if(!$state||$state['month']!==$month) {
  $state=['month'=>$month,'baseCount'=>$count,'target'=>max(WORD_TARGET,$count+WORD_MONTHLY_ADD),'turn'=>0];
  enigmasSetMeta('progress',$state);
 }
 if($count<$state['target']) {
  $turn=$state['turn'];$state['turn']++;enigmasSetMeta('progress',$state);
  $source=$turn%count(WORD_SOURCES);
  $language=intdiv($turn,count(WORD_SOURCES))%3===2?'en':'es';
  wikiSearch($source,0,WORD_BATCH,'all',$language);
 }
 $count=(int)$db->query('SELECT count(*) FROM enigmas')->fetchColumn();$ready=$count>=$state['target'];
 if($ready)enigmasSetMeta('month',$month);
 return ['ready'=>$ready,'count'=>$count,'target'=>$state['target'],'added'=>$count-$state['baseCount']];
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
 $entries=enigmasSelect(WORD_SOURCES[$source][0],$level,[],20);
 if(!$entries)wordsReply(503,['error'=>'No hay enigmas disponibles con esos filtros.','origin'=>'internet']);
 wordsReply(200,['entries'=>$entries,'origin'=>'internet','searchedAt'=>gmdate('c'),'category'=>WORD_SOURCES[$source][0],'level'=>$level]);
} catch(Throwable $error) {
 error_log('Motor ahorcado: '.$error->getMessage());
 wordsReply(503,['error'=>'No se ha podido completar la búsqueda. El catálogo guardado se conserva.']);
}
