import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

// 1. Servir los archivos de Ultraviolet con prioridad
// Esto asegura que /uv/uv.sw.js se sirva como JavaScript y con la cabecera correcta.
app.use('/uv', express.static(join(__dirname, 'uv'), {
    setHeaders: (res, path) => {
        if (path.endsWith('uv.sw.js')) {
            res.set('Service-Worker-Allowed', '/service/');
        }
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// 2. Servir tu archivo index.html y el resto de archivos estáticos
// Al poner esto después, el index.html se servirá para la ruta raíz.
app.use(express.static(__dirname));

// 3. Redirigir cualquier otra ruta a index.html (útil si usas rutas de cliente)
app.get('*', (req, res) => {
    // Evitar que las rutas de /uv/ caigan aquí
    if (!req.path.startsWith('/uv/')) {
        res.sendFile(join(__dirname, 'index.html'));
    }
});

app.listen(port, () => {
    console.log(`🚀 Servidor Waevo escuchando en el puerto ${port}`);
});
