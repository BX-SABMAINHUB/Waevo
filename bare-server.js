import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'node:http';

const bare = createBareServer('/');
const server = http.createServer();

// CORS para que tu frontend (waevo.onrender.com) pueda hablar con este servidor
server.on('request', (req, res) => {
    // Cabeceras CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Si la petición es para el Bare server, la manejamos
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        // Si no, respondemos un 200 simple para que Render sepa que estamos vivos
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Bare server is running.');
    }
});

// WebSockets (algunos sitios los usan)
server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`✅ Bare server Waevo escuchando en el puerto ${port}`);
});
