// uv.sw.js - Service Worker de Ultraviolet
// El orden de importación es OBLIGATORIO: primero el bundle, luego la config.

importScripts('./uv.bundle.js');
importScripts('./uv.config.js');

// Inicializamos el Service Worker y escuchamos las peticiones.
const sw = new UVServiceWorker();
self.addEventListener('fetch', (event) => event.respondWith(sw.fetch(event)));
