<?php
declare(strict_types=1);
// Guardar junto a api/palabras.php. Ejecutar por CLI o mediante una tarea cron.
// No permite lanzar la generación desde una dirección web.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
define('AHORCADO_WORDS_LIBRARY', true);
define('AHORCADO_BACKGROUND_SYNC', true);
require __DIR__.'/palabras.php';

$dir = __DIR__.'/datos';
if (!is_dir($dir) || !is_writable($dir)) {
    fwrite(STDERR, "La carpeta api/datos debe existir y permitir escritura.\n");
    exit(1);
}
$lock = fopen($dir.'/actualizar-catalogo.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
    if (is_resource($lock)) fclose($lock);
    echo "Ya hay una actualización en curso.\n";
    exit(0);
}

$retryFile = $dir.'/actualizar-catalogo-espera.json';
$status = 0;
try {
    $retry = is_file($retryFile) ? json_decode((string)file_get_contents($retryFile), true) : null;
    if (($retry['retryAt'] ?? 0) > time()) {
        echo "Actualización aplazada hasta ".gmdate('c', (int)$retry['retryAt']).".\n";
    } else {
        do {
            $result = wordsSync();
            if (!empty($result['busy'])) {
                echo "El catálogo está ocupado; se reintentará en la próxima ejecución.\n";
                break;
            }
            $count = (int)($result['count'] ?? 0);
            $target = (int)($result['target'] ?? WORD_TARGET);
            echo gmdate('c')." — {$count} / {$target} enigmas verificados.\n";
            if (!empty($result['ready'])) {
                $catalog = $result['catalog'] ?? wordsCatalog();
                if (count($catalog['entries'] ?? []) < WORD_TARGET) {
                    throw new RuntimeException('El catálogo completo no alcanza el mínimo.');
                }
                // Copia portátil para una instalación nueva y para la caché del navegador.
                // wordsWrite usa un temporal y renombrado: nunca publica un JSON truncado.
                wordsWrite(dirname(__DIR__).'/catalogo-inicial.json', $catalog);
                wordsWrite($retryFile, ['retryAt'=>time()+3600, 'updatedAt'=>gmdate('c'), 'failures'=>0]);
                echo "Catálogo completo guardado en catalogo-inicial.json.\n";
                break;
            }
            // Un lote pequeño cada quince minutos, aunque cron despierte cada cinco.
            wordsWrite($retryFile, ['retryAt'=>time()+900, 'updatedAt'=>gmdate('c'), 'failures'=>0]);
            break;
        } while (false);
    }
} catch (Throwable $error) {
    $message = $error->getMessage();
    // Evitar insistir si la fuente limita peticiones o se encuentra indisponible.
    $onlineBusy = str_contains($message, 'búsqueda online reciente');
    $failures = $onlineBusy ? (int)($retry['failures'] ?? 0) : min(5, (int)($retry['failures'] ?? 0) + 1);
    $delay = $onlineBusy ? 300 : (str_contains($message, '429') ? min(21600, 3600 * (2 ** max(0, $failures - 1))) : 900);
    wordsWrite($retryFile, ['retryAt'=>time()+$delay, 'updatedAt'=>gmdate('c'), 'failures'=>$failures]);
    if ($onlineBusy) {
        echo "Cron en pausa para dar prioridad al juego online. Reintento en {$delay} segundos.\n";
    } else {
        fwrite(STDERR, "No se ha completado este lote; se conserva el progreso. Reintento en {$delay} segundos.\n");
        error_log('Actualización del catálogo: '.$message);
    }
    $status = $onlineBusy ? 0 : 1;
} finally {
    flock($lock, LOCK_UN);
    fclose($lock);
}
exit($status);
