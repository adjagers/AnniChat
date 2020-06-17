const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./public/utils/messages');
const db = require('./queries')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/js',express.static('public/utils'));

const botName = 'Annichat Bot';

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Runs the client


io.on('connection', socket => {
    socket.on('joinRoom', (data) => {
        socket.join(data.room);

        db.getChats.then( val => {
            console.log(val);
        })
    });

    // Listen for user message
    socket.on('message', (data) => {
        console.log(`message ${data.msg}`);
        var message = {
            name: "User",
            room: data.room,
            text: data.msg
        };

        let insert = db.insertChats(message);
        
    })

       // User disconnects to server
       socket.on('disconnect', () => {
         console.log('user disconnected')
    });

    // User and Chat info

    
});



