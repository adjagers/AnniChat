var url = window.location.href;
var roomArr = url.split('/');
var roomName = roomArr[roomArr.length-1];
var validRooms = ["chillout-place", "nightlife", "serie-movies", "sports"];
var isCurrentRoom = validRooms.includes(roomName);



if (isCurrentRoom) {
    const room = roomName;
    const socket = io('/tech');
    $('form').submit(() => {
        let msg = $('#m').val();
        let user = localStorage.getItem('userName');
        socket.emit('message', {msg, room, user});
        $('#m').val('');
        return false;
      });
      socket.on('connect', () => {
        let user = localStorage.getItem('userName');
        $('#room-name').append($('<li class="user">').text(roomName));
        $('#users').append($('<li class="user">').text(user));
        socket.emit('join', { room: room, user:user });

      });

      socket.on('message', (data) => {
        let user = localStorage.getItem('userName');

        if(user === data.user) {
            console.log('lol')
            $('#messages').append($('<li class="mine">').text(data.msg+' - '+data.user+data.date_time));
        } else {
            $('#messages').append($('<li class="other">').text(data.msg+' - '+data.user));
        }
          
      });



      socket.on('singleMessage', (msg) => {
        $('#messages').append($('<li>').text(msg));
      });

      socket.on('historyChats', (data) => {
        let user = localStorage.getItem('userName');

        for (var i = 0; i < data.length; i++) {
          if(user == data[i].user_name){
            $('#messages').append($('<li class="mine">').text(data[i].chat_text +'-'+data[i].user_name));
          } else {
            $('#messages').append($('<li class="other">').text(data[i].chat_text +'-'+data[i].user_name));
          }
        }
      });
    }



