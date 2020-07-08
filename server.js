const path = require('path');
const http = require('http');
const moment = require('moment');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./public/utils/messages');
const db = require('./queries')
const app = express();
const server = http.createServer(app);
const io = socketio(server);
var fs = require('fs')
const port = process.env.PORT || 3000; server.listen(port, () => { console.log(`Server is running on port ${port}`); });

   // Routing with express
app.use(express.static('public'));

app.get('/', (req, res) => { res.sendFile(__dirname + '/public/index.html'); });
app.get('/rooms', (req, res) => { res.sendFile(__dirname + '/public/rooms.html'); });
app.get('/friends', (req, res) => { res.sendFile(__dirname + '/public/friends.html'); });
app.get('/chillout-place', (req, res) => { res.sendFile(__dirname + '/public/chat.html'); });
app.get('/nightlife', (req, res) => { res.sendFile(__dirname + '/public/chat.html'); });
app.get('/serie-movies', (req, res) => { res.sendFile(__dirname + '/public/chat.html'); });
app.get('/sports', (req, res) => { res.sendFile(__dirname + '/public/chat.html'); });

const botName = 'Annichat Bot';
const tech = io.of('/tech');


// Runs the client
tech.on('connection', (socket, data) => {

    socket.on('join', (data) => {
        socket.join(data.room);

        db.getUsers(data.room).then(val => {
          tech.to(socket.id).emit('friends', val);
          })

        db.getChats(data.room).then(val => {
            tech.to(socket.id).emit('historyChats', val);
            tech.in(data.room).emit('singleMessage', `${data.user} joined ${data.room}`)
        });

    });
    // Listen for user message
    socket.on('message', (data) => {
        console.log(`message ${data.msg}`)
        var message = {
        user: data.user,
        room: data.room,
        msg: data.msg
        }
        let insert = db.insertChats(message);
        tech.in(data.room).emit('message', message);
    });

    // Adding image file


    socket.on('Serverbase64File', function (msg) {
      console.log('recieved base64 file from' + msg.username);
      tech.in(msg.roomName).emit('Clientbase64File',
      {
        username: msg.username,
        file: msg.file,
        fileName: msg.fileName
      }
    );
    });

    // User disconnects to server
    socket.on('disconnect', () => {
        tech.emit('singleMessage', `user disconnected`);

    });

    });
