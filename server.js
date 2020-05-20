const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./public/utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./public/utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/js',express.static('public/utils'));

const botName = 'Annichat Bot';

const port = process.env.port || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Runs the client

io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'welcome to AnniChat!'));


    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    });

    // Listen for user message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

       // User disconnects to server
       socket.on('disconnect', () => {
           const user = userLeave(socket.id);

        if(user) {
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }
    });
});



