const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);

const PORT = process.env.PORT || 8000;

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Store connected usernames
const connectedUsers = new Set();

io.on('connection', (socket) => {
  console.log('Connected....');

  socket.on('connect', () => {
    // Broadcast the message to all connected clients except the sender
    socket.broadcast.emit('message', { user: 'System', message: `${uname} has connected.` });
    connectedUsers.add(socket.id);
  });

  socket.on('message', (msg) => {
    // Broadcast the message to all connected clients
    socket.broadcast.emit('message', msg);
  });

 
});

http.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
