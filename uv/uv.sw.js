// /uv/uv.sw.js
// Service Worker de Ultraviolet - Carga UV desde CDN y usa tu backend de Koyeb

importScripts(
  'https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.1.0/dist/uv.bundle.js',
  'https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.1.0/dist/uv.config.js'
);

// Configuración personalizada — sobreescribe la del CDN
self.__uv$config = {
  bare: 'https://grim-billy-fxmusicbots-f08a58fc.koyeb.app/',
  prefix: '/service/',
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: 'https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.1.0/dist/uv.handler.js',
  bundle: 'https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.1.0/dist/uv.bundle.js',
  config: 'https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.1.0/dist/uv.config.js',
  sw: 'https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.1.0/dist/uv.sw.js',
};

const uv = new UVServiceWorker();

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      if (uv.route(event)) {
        return await uv.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});
