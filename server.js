const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));


// Runs the client

io.on('connection', socket => {

    // User connects to server
    console.log('new connection')
    socket.emit('message', 'welcome to AnniChat!');
    socket.broadcast.emit('message', 'A user has joined the chat.');

    // User disconnects to server
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat.')
    });

    // Listen for user message
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    })
});



const port = process.env.port || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});