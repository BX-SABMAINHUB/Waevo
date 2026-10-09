import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

// 1. Servir los archivos de Ultraviolet PRIMERO y con prioridad.
// Esto asegura que cualquier ruta que empiece por /uv/ sea atendida aquí.
app.use('/uv', express.static(join(__dirname, 'uv'), {
    setHeaders: (res, path) => {
        // Permite al Service Worker controlar el prefijo /service/
        if (path.endsWith('uv.sw.js')) {
            res.set('Service-Worker-Allowed', '/service/');
        }
        // Asegura que los archivos .js se sirvan con el tipo MIME correcto
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// 2. Servir el resto de archivos estáticos (tu index.html, CSS, etc.)
app.use(express.static(__dirname));

// 3. Redirigir cualquier otra ruta a tu index.html para que la SPA cargue bien
app.get('*', (req, res) => {
    // Si la ruta no es de /uv/, enviamos el index.html
    if (!req.path.startsWith('/uv/')) {
        res.sendFile(join(__dirname, 'index.html'));
    }
});

app.listen(port, () => {
    console.log(`🚀 Servidor Waevo escuchando en el puerto ${port}`);
});
