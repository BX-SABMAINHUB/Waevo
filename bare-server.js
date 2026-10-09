import { createBareServer } from '@tomphttp/bare-server-node';
import express from 'express';
import http from 'node:http';

const bare = createBareServer('/');
const app = express();

// CORS para que tu frontend pueda llamar al servidor
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

const server = http.createServer(app);

// Manejar peticiones del Bare server
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`✅ Bare server Waevo en puerto ${port}`);
});
