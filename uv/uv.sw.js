// uv.sw.js - Service Worker de Ultraviolet
// El orden de importación es OBLIGATORIO.

// 1. Primero, el bundle que define el objeto global Ultraviolet.
importScripts('./uv.bundle.js');

// 2. Segundo, la configuración que usa ese objeto global.
importScripts('./uv.config.js');

// 3. Tercero, el propio Service Worker.
importScripts('./uv.sw.js');

// 4. Inicializamos el Service Worker y escuchamos las peticiones.
const sw = new UVServiceWorker();
self.addEventListener('fetch', (event) => event.respondWith(sw.fetch(event)));
