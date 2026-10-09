import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

// 1. Servir archivos de Ultraviolet PRIMERO
app.use('/uv', express.static(join(__dirname, 'uv'), {
    setHeaders: (res, path) => {
        // Permite al Service Worker controlar /service/
        if (path.endsWith('uv.sw.js')) {
            res.set('Service-Worker-Allowed', '/service/');
        }
        // Asegura el tipo MIME correcto
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// 2. Servir el resto de archivos estáticos (index.html, CSS, etc.)
app.use(express.static(__dirname));

// 3. 🚨 BLOQUEO ANTI-BUCLE: Evitar que /service/ devuelva el index.html
// Si el Service Worker falla, esta ruta atrapará la petición y evitará el "navegador dentro del navegador"
app.use('/service', (req, res) => {
    console.error('⚠️ Petición a /service/ llegó al servidor. El Service Worker NO está funcionando.');
    res.status(503).send('Error: El proxy no está activo. Por favor, recarga la página (Ctrl+F5) y verifica la consola.');
});

// 4. Catch-all para la app
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Servidor Waevo escuchando en el puerto ${port}`);
});
