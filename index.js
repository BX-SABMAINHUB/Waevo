import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 10000; // Render usa el puerto 10000 por defecto

// Sirve todos los archivos estáticos de tu proyecto (index.html, /uv/, etc.)
app.use(express.static(__dirname));

// Redirige todas las peticiones a tu index.html
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Servidor Waevo escuchando en el puerto ${port}`);
});
