import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

console.log('🚀 Iniciando servidor Waevo...');
console.log('📁 Directorio raíz:', __dirname);

// ═══════════════════════════════════════════════════════════
// 1. SERVIR LOS ARCHIVOS DE ULTRAVIOLET (CON PRIORIDAD)
// ═══════════════════════════════════════════════════════════
// Esta ruta debe ir PRIMERO para asegurar que /uv/uv.sw.js,
// /uv/uv.bundle.js, etc. se sirvan con el tipo MIME correcto
// y con la cabecera Service-Worker-Allowed.
app.use('/uv', express.static(join(__dirname, 'uv'), {
    setHeaders: (res, filePath) => {
        // Permite al Service Worker controlar el prefijo /service/
        if (filePath.endsWith('uv.sw.js')) {
            res.set('Service-Worker-Allowed', '/service/');
        }
        // Asegura que los archivos .js se sirvan con el tipo MIME correcto
        if (filePath.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript; charset=utf-8');
        }
        // Evita el caché agresivo durante el desarrollo
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
}));

// ═══════════════════════════════════════════════════════════
// 2. BLOQUEAR PETICIONES A /service/ SI EL SW NO ESTÁ ACTIVO
// ═══════════════════════════════════════════════════════════
// Si el Service Worker falla, esta ruta evita que se devuelva
// el index.html dentro del iframe (el "navegador dentro del navegador").
app.use('/service', (req, res) => {
    console.error('⚠️  Petición a /service/ llegó al servidor.');
    console.error('   Esto significa que el Service Worker NO está funcionando.');
    res.status(503).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Proxy no activo</title></head>
        <body style="font-family:system-ui;padding:40px;text-align:center;background:#0a0a12;color:#f1f5f9;">
            <h1 style="color:#ff2d6b;">⚠️ El proxy no está activo</h1>
            <p>El Service Worker de Ultraviolet no se ha registrado correctamente.</p>
            <p><strong>Pasos para solucionarlo:</strong></p>
            <ol style="text-align:left;max-width:500px;margin:20px auto;">
                <li>Recarga la página con <kbd>Ctrl + Shift + R</kbd></li>
                <li>Abre la consola del navegador (F12) y busca errores en rojo</li>
                <li>Verifica que los 4 archivos estén en <code>/uv/</code>:
                    <ul>
                        <li>uv.bundle.js</li>
                        <li>uv.config.js</li>
                        <li>uv.handler.js</li>
                        <li>uv.sw.js</li>
                    </ul>
                </li>
                <li>Comprueba que el Servidor Bare esté activo</li>
            </ol>
        </body>
        </html>
    `);
});

// ═══════════════════════════════════════════════════════════
// 3. SERVIR EL RESTO DE ARCHIVOS ESTÁTICOS
// ═══════════════════════════════════════════════════════════
app.use(express.static(__dirname));

// ═══════════════════════════════════════════════════════════
// 4. CATCH-ALL: Cualquier otra ruta devuelve el index.html
// ═══════════════════════════════════════════════════════════
app.get('*', (req, res) => {
    // Si la ruta no es de /uv/ ni /service/, enviamos el index.html
    if (!req.path.startsWith('/uv/') && !req.path.startsWith('/service/')) {
        res.sendFile(join(__dirname, 'index.html'));
    }
});

// ═══════════════════════════════════════════════════════════
// 5. INICIAR EL SERVIDOR
// ═══════════════════════════════════════════════════════════
app.listen(port, () => {
    console.log(`✅ Servidor Waevo escuchando en el puerto ${port}`);
    console.log(`🌐 URL: https://waevo.onrender.com/`);
});
