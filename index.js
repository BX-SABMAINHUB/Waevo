import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

console.log('🚀 Iniciando servidor Waevo...');
console.log('📁 Directorio raíz:', __dirname);

// ═══════════════════════════════════════════════════════════
// RUTA DE DIAGNÓSTICO (para saber qué archivos hay en /uv/)
// Visita: https://waevo.onrender.com/diagnostico
// ═══════════════════════════════════════════════════════════
app.get('/diagnostico', (req, res) => {
    const uvPath = join(__dirname, 'uv');
    let uvFiles = [];
    if (existsSync(uvPath)) {
        uvFiles = readdirSync(uvPath);
    }
    res.json({
        servidor: 'OK',
        puerto: port,
        directorioRaiz: __dirname,
        carpetaUvExiste: existsSync(uvPath),
        archivosEnUv: uvFiles,
        archivosEsperados: ['uv.bundle.js', 'uv.config.js', 'uv.handler.js', 'uv.sw.js'],
        archivosFaltantes: ['uv.bundle.js', 'uv.config.js', 'uv.handler.js', 'uv.sw.js'].filter(f => !uvFiles.includes(f)),
        indexHtmlExiste: existsSync(join(__dirname, 'index.html')),
        packageJsonExiste: existsSync(join(__dirname, 'package.json'))
    });
});

// ═══════════════════════════════════════════════════════════
// 1. SERVIR ARCHIVOS DE ULTRAVIOLET (PRIORIDAD MÁXIMA)
// ═══════════════════════════════════════════════════════════
app.use('/uv', express.static(join(__dirname, 'uv'), {
    setHeaders: (res, filePath) => {
        // Permite al Service Worker controlar /service/
        if (filePath.endsWith('uv.sw.js')) {
            res.set('Service-Worker-Allowed', '/service/');
        }
        // Asegura el tipo MIME correcto para TODOS los .js
        if (filePath.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript; charset=utf-8');
        }
        // Sin caché para evitar versiones antiguas
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    },
    // No servir el index.html si no encuentra el archivo
    fallthrough: true
}));

// ═══════════════════════════════════════════════════════════
// 2. BLOQUEAR /service/ SI EL SERVICE WORKER NO ESTÁ ACTIVO
// ═══════════════════════════════════════════════════════════
app.use('/service', (req, res) => {
    console.error('⚠️  Petición a /service/ llegó al servidor (SW no activo).');
    res.status(503).type('html').send(`
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Proxy no activo</title></head>
        <body style="font-family:system-ui;padding:40px;text-align:center;background:#0a0a12;color:#f1f5f9;">
            <h1 style="color:#ff2d6b;font-size:2rem;">⚠️ El proxy no está activo</h1>
            <p>El Service Worker de Ultraviolet no se ha registrado correctamente.</p>
            <p><strong>Pasos para solucionarlo:</strong></p>
            <ol style="text-align:left;max-width:550px;margin:20px auto;line-height:1.8;">
                <li>Recarga la página con <kbd style="background:#1a1a26;padding:2px 8px;border-radius:4px;">Ctrl + Shift + R</kbd></li>
                <li>Abre la consola del navegador con <kbd style="background:#1a1a26;padding:2px 8px;border-radius:4px;">F12</kbd> y busca errores en rojo</li>
                <li>Visita <a href="/diagnostico" style="color:#00e5ff;">/diagnostico</a> para verificar que los 4 archivos están en <code>/uv/</code></li>
                <li>Comprueba que el Servidor Bare esté activo (URL en <code>uv.config.js</code>)</li>
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
// 4. CATCH-ALL: Cualquier otra ruta devuelve index.html
// ═══════════════════════════════════════════════════════════
app.get('*', (req, res) => {
    if (!req.path.startsWith('/uv/') && !req.path.startsWith('/service/')) {
        res.sendFile(join(__dirname, 'index.html'));
    }
});

// ═══════════════════════════════════════════════════════════
// 5. INICIAR EL SERVIDOR
// ═══════════════════════════════════════════════════════════
app.listen(port, () => {
    console.log(`✅ Servidor Waevo escuchando en el puerto ${port}`);
    console.log(`🌐 Visita: /diagnostico para ver el estado`);
});
