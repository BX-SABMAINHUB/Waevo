import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

// 1. Servir archivos estáticos de UV con prioridad y cabeceras correctas
app.use('/uv', express.static(join(__dirname, 'uv'), {
    setHeaders: (res, path) => {
        // Permite al Service Worker controlar /service/
        if (path.endsWith('uv.sw.js')) {
            res.set('Service-Worker-Allowed', '/service/');
        }
        // Asegura que los .js se sirvan con el tipo MIME correcto
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// 2. Servir el resto de archivos estáticos (tu index.html, CSS, etc.)
app.use(express.static(__dirname));

// 3. Bloquear peticiones a /service/ si el Service Worker no está activo
//    (evita el bucle de "navegador dentro del navegador")
app.use('/service', (req, res) => {
    console.error('⚠️ Petición a /service/ llegó al servidor. El Service Worker NO está funcionando.');
    res.status(503).send('Error: El proxy no está activo. Recarga la página (Ctrl+F5) y verifica la consola.');
});

// 4. Catch-all para la SPA
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Servidor Waevo escuchando en el puerto ${port}`);
});
