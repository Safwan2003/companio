const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('set nickname', (nickname) => {
    socket.nickname = nickname;
  });

  socket.on('join room', (room) => {
    socket.join(room); // Join the room on the server side
    io.to(room).emit('room joined', `${socket.nickname} joined the room`);
  });

  socket.on('leave room', (room) => {
    socket.leave(room);
  });

  socket.on('typing', () => {
    socket.to(socket.rooms.values().next().value).emit('typing', socket.nickname);
  });

  socket.on('chat message', (data) => {
    const { message, nickname, room } = data;
    io.to(room).emit('chat message', { message, nickname, timestamp: new Date().toLocaleTimeString() });
  });

  socket.on('private message', (data) => {
    const { recipient, message } = data;
    io.to(recipient).emit('private message', { message, sender: socket.nickname });
  });

  socket.on('disconnect', () => {
    io.emit('user disconnected', socket.nickname);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
