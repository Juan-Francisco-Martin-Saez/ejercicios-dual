
/* node --env-file=.env vastai-ocr-test.mjs "documento.pdf" */

import fs from 'node:fs/promises';
import path from 'node:path';

const VAST_API_KEY = process.env.VAST_API_KEY;
const OCR_API_KEY = process.env.OCR_API_KEY;
const VAST_INSTANCE_ID = process.env.VAST_INSTANCE_ID;
const archivo = process.argv[2];

async function obtenerServidorOCR() {
  const response = await fetch(
    'https://console.vast.ai/api/v1/instances/?owner=me',
    {
      headers: {
        Authorization: `Bearer ${VAST_API_KEY}`
      }
    }
  );

  if (!response.ok) {
  const detalle = await response.text();
  throw new Error(
    `Vast.ai HTTP ${response.status}: ${detalle}`
  );
}

  const data = await response.json();

  const candidatas = data.instances.filter(i =>
    i.actual_status === 'running' &&
    i.ports?.['10001/tcp']?.[0]?.HostPort
  );

  const instancia = VAST_INSTANCE_ID
    ? candidatas.find(i => String(i.id) === VAST_INSTANCE_ID)
    : candidatas.length === 1 ? candidatas[0] : null;

  if (!instancia) {
    throw new Error(
      'No hay una instancia OCR única y operativa. ' +
      'Comprueba el puerto 10001 o indica VAST_INSTANCE_ID.'
    );
  }

  const ip = instancia.public_ipaddr;
  const puerto = instancia.ports['10001/tcp'][0].HostPort;

  if (!ip || !puerto) {
    throw new Error('IP o puerto público no disponible');
  }

  console.log('Instancia:', instancia.id);
  console.log('IP:', ip);
  console.log('Puerto:', puerto);

  return `http://${ip}:${puerto}`;
}

async function comprobarModelo(url) {
  const response = await fetch(`${url}/ready`, {
    headers: {
      Authorization: `Bearer ${OCR_API_KEY}`
    },
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    const detalle = await response.text();
    throw new Error(
      `Vast.ai HTTP ${response.status}: ${detalle}`
    );
  }

  console.log('Modelo preparado:', await response.json());
}

async function ejecutarOCR(url, archivo) {
  const buffer = await fs.readFile(archivo);

  const tipos = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  };

  const extension = path.extname(archivo).toLowerCase();
  const tipo = tipos[extension];

  if (!tipo) throw new Error('Formato no admitido');

  const form = new FormData();

  form.append(
    'file',
    new Blob([buffer], { type: tipo }),
    path.basename(archivo)
  );

  form.append('dpi', '200');
  form.append('crop_mode', 'true');
  form.append('tokens_per_page', '4000');

  console.log('Enviando documento al OCR...');

  const inicio = Date.now();

  const response = await fetch(`${url}/ocr`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OCR_API_KEY}`
    },
    body: form,
    signal: AbortSignal.timeout(900000)
  });

  if (!response.ok) {
    throw new Error(
      `OCR HTTP ${response.status}: ${await response.text()}`
    );
  }

  const resultado = await response.json();

  console.log('\n===== RESULTADO =====');
  console.log('Páginas:', resultado.pages);
  console.log('Tiempo servidor:', resultado.elapsed_ms, 'ms');
  console.log('Tiempo total:', Date.now() - inicio, 'ms');

  console.log('\n===== TEXTO =====\n');
  console.log(resultado.text);

  await fs.writeFile('resultado-ocr.txt', resultado.text);
  await fs.writeFile(
    'resultado-ocr.json',
    JSON.stringify(resultado, null, 2)
  );
}

async function main() {
  if (!VAST_API_KEY || !OCR_API_KEY || !archivo) {
    throw new Error('Faltan credenciales o ruta del documento');
  }

  const url = await obtenerServidorOCR();

  await comprobarModelo(url);

  await ejecutarOCR(url, archivo);
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exitCode = 1;
});
