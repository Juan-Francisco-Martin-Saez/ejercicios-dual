'use strict';

const BASE = new URL('./', self.location.href);
const PREFIX = 'ahorcado-offline-' + encodeURIComponent(BASE.pathname) + '-';
const CACHE = PREFIX + 'v5';
const POLICY = 'descubrimiento-cultural-v5';
const INDEX = new URL('index.html', BASE).href;
const MOTOR = new URL('motor.js', BASE).href;
const SEED = new URL('catalogo-inicial.json', BASE).href;
const API_PATH = new URL('api/', BASE).pathname;

async function network(request) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    return await fetch(request, {
      signal: controller.signal,
      cache: 'no-store'
    });
  } finally {
    clearTimeout(timer);
  }
}

async function canStore(response, key) {
  if (!response.ok || response.type === 'opaque') return false;

  if (response.url) {
    const finalURL = new URL(response.url);

    if (
      finalURL.origin !== BASE.origin ||
      !finalURL.pathname.startsWith(BASE.pathname)
    ) return false;
  }

  if (key === SEED) {
    try {
      const data = await response.clone().json();

      return data.recognitionPolicy === POLICY &&
        Array.isArray(data.entries) &&
        data.entries.length > 0 &&
        data.entries.every(item =>
          item && item.recognitionPolicy === POLICY
        );
    } catch {
      return false;
    }
  }

  return true;
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);

    // Guardar el juego aunque el catálogo inicial aún no esté publicado.
    await Promise.all([INDEX, MOTOR].map(async key => {
      const response = await network(new Request(key));

      if (!await canStore(response, key)) {
        throw new Error('No se puede guardar el juego.');
      }

      await cache.put(key, response);
    }));

    // El catálogo inicial es opcional y debe cumplir los nuevos criterios.
    try {
      const response = await network(new Request(SEED));

      if (await canStore(response, SEED)) {
        await cache.put(SEED, response);
      }
    } catch { }

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Limpiar solo versiones de esta carpeta.
    const names = await caches.keys();

    await Promise.all(
      names
        .filter(name => name.startsWith(PREFIX) && name !== CACHE)
        .map(name => caches.delete(name))
    );

    // El catálogo creciente está en IndexedDB y se conserva.
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Las partidas, búsquedas y puntuaciones siempre llegan al servidor.
  if (
    request.method !== 'GET' ||
    url.origin !== BASE.origin ||
    !url.pathname.startsWith(BASE.pathname) ||
    url.pathname.startsWith(API_PATH)
  ) return;

  const clean = new URL(url.pathname, BASE.origin).href;
  let key;

  if (request.mode === 'navigate') {
    if (url.pathname !== BASE.pathname && clean !== INDEX) return;
    key = INDEX;
  } else if (
    clean === MOTOR ||
    clean === SEED ||
    clean === INDEX
  ) {
    // Las distintas versiones de motor.js usan la copia vigente.
    key = clean;
  } else if (
    ['style', 'image', 'font'].includes(request.destination)
  ) {
    key = request.url;
  } else {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);

    try {
      const response = await network(request);

      if (await canStore(response, key)) {
        // Un fallo al guardar no impide usar la respuesta online.
        try {
          await cache.put(key, response.clone());
        } catch { }

        return response;
      }

      return await cache.match(key) || response;
    } catch {
      return await cache.match(key) || new Response(
        'Este recurso todavía no está guardado para usarlo sin conexión.',
        {
          status: 503,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8'
          }
        }
      );
    }
  })());
});