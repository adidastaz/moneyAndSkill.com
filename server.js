const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const port = process.env.PORT || 3000;

const RpsGame = require('./rps-game');

const app = express();

const clientPath = __dirname + '/./client';
console.log('Serving static from ' + clientPath);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

io.on('connection', (sock) => {
    
    if(waitingPlayer) {
        //start game
        new RpsGame(waitingPlayer, sock);
        waitingPlayer = null;
    }

    else {
        waitingPlayer = sock;
        waitingPlayer.emit('message', 'Waiting for an opponent');
    }

    sock.on('message', (text) => {
        io.emit('message', text);
    })
})

server.listen(port, (err) => {
    if(err) throw err;
    else console.log('Rps has started...');
})