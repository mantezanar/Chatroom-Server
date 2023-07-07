const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

const connectedClients = {};

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado.');

  socket.on('register', (clientId) => {
    console.log(`Cliente registrado: ${clientId}`);
    connectedClients[clientId] = socket.id;
  });


  socket.on('chat', (message) => {
    console.log(`Mensaje recibido de ${message.clientId}: ${message.message}`);
    socket.broadcast.emit('chat', message);
  });

  socket.on('disconnect', () => {
    const clientId = Object.keys(connectedClients).find(
      (key) => connectedClients[key] === socket.id
    );

    if (clientId) {
      console.log(`Cliente desconectado: ${clientId}`);
      delete connectedClients[clientId];
    }
  });
});

const port = 8080;
server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
