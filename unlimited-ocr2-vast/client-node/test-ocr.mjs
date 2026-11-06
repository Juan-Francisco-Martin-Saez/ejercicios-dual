/**
 * Node.js >=20 (idealmente 22), sin dependencias.
 * Ejemplo:
 *   $env:OCR_URL="http://IP:PUERTO"  # PowerShell
 *   $env:OCR_API_KEY="..."
 *   node client-node/test-ocr.mjs "C:\\documentos\\pedido.pdf"
 * Usar HTTPS o un túnel privado si hay datos personales/empresariales reales.
 */
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

const url = (process.env.OCR_URL || '').replace(/\/$/, '');
const key = process.env.OCR_API_KEY;
const filename = process.argv[2];

if (!url || !key || !filename) {
  console.error('Uso: configurar OCR_URL, OCR_API_KEY y ejecutar node test-ocr.mjs archivo.pdf');
  process.exit(1);
}

const status = await fetch(`${url}/ready`, {
  headers: { Authorization: `Bearer ${key}` },
  signal: AbortSignal.timeout(10000),
});
if (!status.ok) {
  const msg = await status.text();
  throw new Error(`Modelo aún no disponible (HTTP ${status.status}): ${msg}`);
}

const data = await readFile(filename);
const form = new FormData();
form.append('file', new Blob([data]), basename(filename));
form.append('dpi', '200');
form.append('crop_mode', 'true');
form.append('tokens_per_page', '4000');

const response = await fetch(`${url}/ocr`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}` },
  body: form,
  signal: AbortSignal.timeout(30 * 60 * 1000),
});
const body = await response.text();
if (!response.ok) throw new Error(`HTTP ${response.status}: ${body}`);
const result = JSON.parse(body);
console.log(`Páginas: ${result.pages}. Tiempo servidor: ${result.elapsed_ms} ms.`);
console.log(result.text);
