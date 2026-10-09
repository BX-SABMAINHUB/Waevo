// uv.sw.js - Service Worker de Ultraviolet

// 1. Importamos el bundle de UV (define el objeto global Ultraviolet)
importScripts('./uv.bundle.js');

// 2. Importamos la configuración (usa el objeto Ultraviolet)
importScripts('./uv.config.js');

// 3. Importamos el propio Service Worker de UV
importScripts('./uv.sw.js');

// 4. Instanciamos y añadimos el listener de fetch
const sw = new UVServiceWorker();
self.addEventListener('fetch', (event) => event.respondWith(sw.fetch(event)));
