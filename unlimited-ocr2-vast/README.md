# Unlimited-OCR-2 en Vast.ai — guía de despliegue (06/11/2026)

Proyecto reproducible para ejecutar **baidu/Unlimited-OCR-2** en una GPU alquilada, con el **SGLang modificado por Baidu** y una pasarela **FastAPI autenticada** que acepta PDFs e imágenes. Incluye scripts para crear y publicar imágenes Docker en Docker Hub desde Windows/PowerShell o Linux y un cliente de prueba Node.js.

> **Estado de validación**: el código de la pasarela se ha probado localmente sin GPU (9 pruebas correctas). **No** se han construido ni ejecutado las imágenes Docker completas, **no** se ha cargado el modelo en una GPU y **no** se han publicado imágenes en un registro: esas operaciones requieren Docker, conectividad y hardware que no están disponibles en el entorno de elaboración. El proyecto está preparado para que las ejecutes; puede ser necesario ajustar dependencias según la GPU/driver del host.

## 1. Arquitectura

```text
Windows/Node.js o VPS Node.js
           |
           | HTTP + Bearer token (solo documentos de prueba)
           | PRODUCCIÓN: HTTPS o túnel privado
           v
Vast.ai (GPU NVIDIA):
  imagen Docker [runtime | baked]
     ├─ gateway FastAPI 0.0.0.0:10001  <-- puerto a publicar
     │    ├─ GET  /health
     │    ├─ GET  /ready
     │    └─ POST /ocr (multipart: PDF, JPG, PNG, WebP)
     └─ SGLang modificado 127.0.0.1:10000 (NO PUBLICAR)
          └─ baidu/Unlimited-OCR-2 (3B parámetros)
```

La pasarela autentica con `Authorization: Bearer ...`, convierte cada PDF en imágenes en memoria y envía **todas las páginas del PDF en una sola petición** a SGLang para conservar el contexto multipágina. Devuelve `text` con la salida bruta del modelo, `pages` y `elapsed_ms`. No transforma automáticamente texto OCR en un JSON de pedido: eso corresponde al agente posterior.

## 2. Qué variantes de imagen se preparan

Se usa **un mismo Dockerfile** con el argumento `BAKE_WEIGHTS`:

| Variante | Tag | Peso del modelo | Ventaja | Inconveniente |
|---|---|---|---|---|
| Imagen de ejecución | `usuario/unlimited-ocr2-vast:runtime` | Se descarga al primer arranque en caché local | Publicación Docker más pequeña | Arranque inicial más lento; si destruyes la instancia/caché, habrá que descargar de nuevo |
| Imagen con pesos | `usuario/unlimited-ocr2-vast:baked` | Integrado en la imagen durante la compilación | Evita una descarga específica de pesos tras iniciar | Imagen pesada; el host igualmente tiene que descargar sus capas la primera vez |

**Recomendación inicial**: crear primero `runtime` para comprobar que el *wheel* de SGLang y la GPU son compatibles. Después probar `baked` y comparar tiempos reales de arranque total (incluyendo extracción de imagen y carga del modelo). No se debe presuponer que la variante con pesos será siempre más rápida.

## 3. Requisitos previos

1. Cuenta en [Vast.ai](https://vast.ai) con saldo y capacidad de lanzar instancias.
2. Cuenta en [Docker Hub](https://hub.docker.com) (o registro OCI equivalente).
3. En Windows 10/11: **Docker Desktop** en modo **Linux containers** + WSL2. En Linux: Docker y `docker buildx`.
4. Para probar con Docker local y GPU: controladores NVIDIA compatibles + NVIDIA Container Toolkit. Para **compilar** la imagen no necesitas GPU.
5. Node.js 20 o superior para el cliente (recomendado Node.js 22).
6. Una GPU Vast.ai de **48 GB de VRAM o más** como punto de partida; idealmente **A100/A800/H100 de 80 GB** para la primera validación si el presupuesto lo permite. Baidu documentó inferencia Transformers en A800-80GB. **No se garantiza VRAM mínima de 24/48 GB para SGLang personalizado**: se deberá medir.
7. Reservar aproximadamente **80–120 GB de disco** al principio, según variante, capas, modelos y cachés; comprobar espacio durante la instalación.

El `Dockerfile` parte de `nvidia/cuda:12.8.1-devel-ubuntu22.04` (Python 3.10) y utiliza el *wheel* de SGLang incluido en el repositorio oficial de Baidu. El *wheel* se distribuye mediante **Git LFS**: el Dockerfile efectúa una descarga LFS selectiva, no un `pip install sglang` genérico.

## 4. Preparar Docker y publicar la imagen (PowerShell)

Descomprime el ZIP, abre PowerShell en la carpeta `unlimited-ocr2-vast` y ejecuta:

```powershell
# Comprobaciones iniciales
docker version
docker buildx version

# Inicia sesión en Docker Hub (NO introduzcas credenciales en el código)
docker login

# Construye y publica la primera imagen (sustituye MI_USUARIO)
.\scripts\build-push.ps1 -DockerHubUser MI_USUARIO -Variant runtime

# Opcional, tras comprobar la primera variante:
.\scripts\build-push.ps1 -DockerHubUser MI_USUARIO -Variant baked
```

Las órdenes anteriores usan `docker buildx build --platform linux/amd64 --push`; **publican** la imagen (no solo la construyen en el PC). También puedes ejecutarlas desde Linux/macOS:

```bash
chmod +x scripts/build-push.sh
./scripts/build-push.sh MI_USUARIO runtime
./scripts/build-push.sh MI_USUARIO baked
```

### Compilación local sin publicar

```bash
docker build --platform linux/amd64 --build-arg BAKE_WEIGHTS=0 \
  -t unlimited-ocr2-vast:runtime .
```

En una máquina Linux con NVIDIA Docker Toolkit, copiar `.env.example` a `.env`, introducir un token real y ejecutar `docker compose up --build`. En Windows sin GPU compatible, realiza solo la compilación; la inferencia deberá probarse en Vast.ai.

### Si falla `docker build`

- `File is not a zip file` al instalar el wheel: asegúrate de que `git lfs pull` descargó el fichero y no quedó un puntero LFS.
- `No matching distribution found` o errores de CUDA: el wheel o sus dependencias pueden haber cambiado; revisa el README oficial de Baidu y evita sustituirlo sin más por `sglang` publicado en PyPI.
- `No space left on device`: libera caché de Docker e incrementa espacio.
- Si el wheel oficial cambia de nombre: actualiza la ruta del wheel en el Dockerfile, verifica la versión y reconstruye.

## 5. Crear el template privado en Vast.ai

Ve a [Vast.ai — Templates](https://cloud.vast.ai) y crea una plantilla (*Create Template* / *My Templates*). Configuración:

| Campo en Vast.ai | Valor |
|---|---|
| **Template Name** | `Unlimited-OCR-2 - API privada` |
| **Image Path:Tag** | `MI_USUARIO/unlimited-ocr2-vast:runtime` (o `:baked`) |
| **Launch Mode** | `docker ENTRYPOINT` |
| **Exposed TCP Port** | `10001` (no publicar `10000`) |
| **Disk Space** | Empezar con 100 GB; adaptar al tamaño observado |
| **Environment** | `OCR_API_KEY` (secreto), `MAX_PAGES=12`, `MAX_UPLOAD_MB=25`, `DEFAULT_DPI=200` |
| **Template Visibility** | **Private** |
| **On-start script** | Ninguno en modo `docker ENTRYPOINT` |

**Seguridad:** no incluyas `OCR_API_KEY` ni `HF_TOKEN` en un `Dockerfile`, un `docker build --build-arg`, una plantilla pública o un repositorio Git. En Vast.ai utiliza variables de entorno privadas de cuenta/instancia y mantén la plantilla privada. Genera un token aleatorio de 32 bytes, por ejemplo:

```powershell
# PowerShell 7+: genera una clave aleatoria hexadecimal (64 caracteres)
$b = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Fill($b)
[Convert]::ToHexString($b)
```

En la configuración de Vast.ai registra el token como `OCR_API_KEY` mediante el mecanismo de secretos/variables de cuenta disponible. En casos con registro Docker privado, configura la autenticación del registro en Vast.ai. Una imagen pública sin secretos puede utilizarse con una **plantilla privada**.

**Importante:** Vast.ai asigna normalmente un puerto exterior aleatorio. `EXPOSE 10001` dentro de Docker no implica que puedas acceder a `IP:10001` desde fuera: consulta el mapeo asignado en **IP Port Info**. Por ejemplo, `PUBLIC_IP:33526 → 10001/tcp`.

### Selección de GPU

Para la primera prueba, filtra por GPU NVIDIA con 48–80 GB de VRAM, buena reputación del host, capacidad de disco y disponibilidad suficiente. El rendimiento, la compatibilidad de controladores, la memoria utilizada y el tiempo de inicialización deben comprobarse en el servidor real. Evita planificar 48 lanzamientos al día antes de medir el tiempo de arranque.

## 6. Arrancar y comprobar el funcionamiento

Lanza una instancia desde tu template. Espera a que el contenedor descargue/cargue pesos y a que SGLang esté listo; no hay un tiempo fijo garantizado.

En PowerShell:

```powershell
$base = 'http://IP_PUBLICA:PUERTO_EXTERNO'
$key = 'EL_TOKEN_CONFIGURADO'

# Gateway levantado (no garantiza que el modelo esté cargado)
Invoke-RestMethod -Uri "$base/health" -Headers @{ Authorization = "Bearer $key" }

# Solo devolverá HTTP 200 cuando SGLang anuncie el modelo
Invoke-RestMethod -Uri "$base/ready" -Headers @{ Authorization = "Bearer $key" }

# Una prueba sobre un documento NO SENSIBLE
.\scripts\test-curl.ps1 -Url $base -ApiKey $key -FilePath 'C:\\pruebas\\documento.pdf'
```

Respuesta esperada orientativa (texto ilustrativo, **no inferencia realizada**):

```json
{
  "model": "Unlimited-OCR-2",
  "pages": 2,
  "elapsed_ms": 12500,
  "text": "<PAGE>Contenido reconocido de la primera página ..."
}
```

`elapsed_ms` es un ejemplo ficticio, no una medida de velocidad del modelo. Los textos pueden conservar etiquetas o estructuras que requieren tratamiento posterior.

### Uso desde Node.js

Desde PowerShell:

```powershell
$env:OCR_URL='http://IP_PUBLICA:PUERTO_EXTERNO'
$env:OCR_API_KEY='TU_SECRETO'
node .\client-node\test-ocr.mjs 'C:\\pruebas\\documento.pdf'
```

El cliente `test-ocr.mjs` no requiere instalar paquetes: usa `fetch`, `FormData` y `Blob` nativos de Node.js 20/22. Antes de ponerlo en producción utiliza un transporte cifrado: el token en `Authorization` **no protege la confidencialidad de los archivos por sí solo** cuando se envía mediante HTTP.

## 7. Contrato de la API

- `GET /health`: verifica que la pasarela FastAPI está activa.
- `GET /ready`: verifica que SGLang ha terminado de cargar `Unlimited-OCR-2`.
- `POST /ocr`: formulario `multipart/form-data`.

| Campo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `file` | fichero | obligatorio | PDF, JPG, PNG o WebP |
| `dpi` | entero [96, 300] | 200 | Rasterizado PDF; mayor DPI aumenta el uso de RAM/VRAM |
| `crop_mode` | booleano | `true` | Modo *gundam* del modelo; `false` usa vista base |
| `tokens_per_page` | entero [256, 12000] | 4000 | Presupuesto de generación por página, sujeto al máximo global |

Límites por defecto del contenedor: 25 MB de archivo, 12 páginas, 32 millones de píxeles por página y máximo global de 48.000 tokens por petición. Si hay un documento mayor, divídelo en lotes; dividirlo implica perder parte del contexto transversal entre bloques.

Ejemplo con `curl`:

```bash
curl -fS -X POST "https://OCR_TU_DOMINIO/ocr" \
  -H "Authorization: Bearer $OCR_API_KEY" \
  -F 'file=@documento.pdf' \
  -F 'dpi=200' \
  -F 'crop_mode=true' \
  -F 'tokens_per_page=4000'
```

### Verificación en desarrollo sin GPU

Para probar el gateway sin alquilar Vast.ai:

```bash
python -m pip install -r scripts/requirements-dev.txt
python -m pytest -q tests/test_gateway.py
```

Se comprueban autenticación, formatos, conversión PDF/JPG, validaciones y composición del payload de SGLang con un *mock*. **No prueba ni la compatibilidad real del wheel con CUDA ni la calidad OCR.**

## 8. Preparación para producción: seguridad y costes

**8.1 Cifrado y protección de datos**. La plantilla expone un puerto TCP y FastAPI sirve HTTP sin TLS de forma predeterminada. **Utiliza exclusivamente archivos sintéticos o públicos durante las primeras pruebas**. Para documentación comercial real, utiliza una conexión HTTPS terminada en un proxy gestionado o un túnel privado (por ejemplo, Cloudflare Tunnel con un nombre de host estable y políticas Access, Tailscale o WireGuard). La protección por token es un segundo factor, no sustituye TLS. Si el contenido incluye datos personales, comprueba región de alojamiento, contrato de encargado de tratamiento, retención, transferencias internacionales y autorizaciones correspondientes. El host de GPU puede tener acceso operativo a los datos procesados.

**8.2 Ciclo de vida de Vast.ai**. Distingue `stop` (puede mantener el almacenamiento facturable) de `destroy` (elimina datos asociados a la instancia). Un volumen persistente puede sobrevivir a una instancia, pero su reutilización depende de la localización del host. No presupongas que los pesos permanecen disponibles en cualquier host nuevo. Una imagen Docker con pesos reduce la descarga de los pesos por separado, pero **no** elimina la descarga de las capas Docker en cada host nuevo.

**8.3 Coste real por lote**. Registra: tiempo de búsqueda de oferta; descarga/extracción de la imagen; carga de pesos; preparación y OCR por página; tiempo hasta destrucción; precio GPU/h; almacenamiento; salida de datos. Si el ciclo de arranque es costoso, agrupa correos y ejecuta OCR de forma menos frecuente o utiliza un volumen persistente/servidor estable según el volumen real.

**8.4 Resiliencia**. Conserva estado de los correos en tu VPS antes de llamar a Vast.ai; usa identificadores idempotentes y reintentos controlados. No destruyas la instancia hasta haber confirmado que recibiste y persististe la respuesta OCR. Para el pipeline previsto, deja extracción de productos, resolución de ambigüedades y presupuestos al agente posterior al OCR.

## 9. Problemas habituales

| Síntoma | Comprobación |
|---|---|
| `/health` devuelve 200 y `/ready` 503 | SGLang aún descarga/carga pesos, o falló; consultar logs del contenedor |
| Error `CUDA out of memory` | Probar GPU mayor, menor concurrencia, `crop_mode=false`, menos páginas o ajustar memoria estática |
| No se puede acceder al puerto | Revisar `IP Port Info` de Vast.ai y que se publica `10001`, no `10000` |
| `401` / `403` | Falta `Authorization: Bearer ...` o el token es incorrecto |
| Respuesta 413 | Archivo, páginas o resolución demasiado grandes; dividir PDF o bajar DPI |
| Arranque lento en imagen `runtime` | Primera descarga de pesos y creación de caché; comparar con `baked` |
| Error al resolver dependencias | Alinear wheel de Baidu, Python 3.10, CUDA y versión de sus bibliotecas |
| `docker ENTRYPOINT` no se ejecuta en Vast | Confirmar que NO elegiste SSH/Jupyter, que sustituyen el entrypoint |
| OCR no devuelve JSON de productos | Correcto: devuelve texto bruto, que debe analizar tu agente Node/Qwen |

## 10. Referencias oficiales (consultadas el 06/11/2026)

- Modelo y guía técnica: https://huggingface.co/baidu/Unlimited-OCR-2
- Código de Baidu, wheel modificado y ejemplo SSE: https://github.com/baidu/Unlimited-OCR
- Configurar templates en Vast.ai: https://docs.vast.ai/guides/templates/template-settings
- Entorno Docker y puertos de Vast.ai: https://docs.vast.ai/guides/instances/docker-environment

**Limitación clave:** esto es un *proyecto de construcción y despliegue*, no un contenedor OCI ya construido ni una imagen publicada. El primer build y la prueba de GPU deben ejecutarse en una máquina real con conexión a los registros indicados.
