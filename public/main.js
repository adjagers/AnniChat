var url = window.location.href;
var roomArr = url.split('/');
var roomName = roomArr[roomArr.length-1];
var validRooms = ["chillout-place", "nightlife", "serie-movies", "sports"];
var isCurrentRoom = validRooms.includes(roomName);

// When user authenticates

$('#submit').click(function (e) {
  e.preventDefault();
  if ($.trim($('#nickname').val()) == '') {
      $('.message_failed').append('<div>Enter your nickname above</div>');
  } else {

      var inputvalue = $('#nickname').val()
      localStorage.setItem('userName', inputvalue)
      return window.location.href = "/rooms";
  }
});


// When message send

if (isCurrentRoom) {
    const room = roomName;
    const socket = io('/tech');
    $('form').submit(() => {
        let msg = $('#m').val();
        let user = localStorage.getItem('userName');
        socket.emit('message', {msg, room, user});
        $('#m').val('');
        console.log('entered a message')
        return false;
      });




      // When enter chat room

      socket.on('connect', () => {
        let user = localStorage.getItem('userName');
        console.log(user);
        $('#users').append($('<li class="user">').text(user));
        socket.emit('join', { room: room, user: user});
      });

      socket.on('showRoomName', () => {

      })

      socket.on('message', (data) => {
        let user = localStorage.getItem('userName');

        if(user === data.user) {
            console.log('message')
            $('#messages').append($('<li class="mine">').text(data.msg+' - '+data.user));
        } else {
            $('#messages').append($('<li class="other">').text(data.msg+' - '+data.user));
        }

      });

      socket.on('friends', (data) => {
        let user = localStorage.getItem('userName');
        for (var i = 0; i < data.length; i++) {
          if(user == data[i].user_name){
            $('#users').append($('<li class="user">').text(data[i].user_name));
          } else {
            console.log('nope denied');
          }
        }
      });

      socket.on('singleMessage', (msg) => {
        $('#messages').append($('<li>').text(msg));
      });

      // Showing Old messages chats
      socket.on('historyChats', (data) => {
        let user = localStorage.getItem('userName');

        for (var i = 0; i < data.length; i++) {
          if(user == data[i].user_name){
            $('#messages').append($('<li class="flex-item">').text(data[i].user_name+'-'+data[i].chat_text ));
          } else {
            $('#messages').append($('<li class="other">').text(data[i].user_name +'-'+ data[i].chat_text ));
          }
        }
      });


      $('#uploadfile').bind('change', async function (event) {

       const imageFile = event.target.files[0];
       console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
       console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

       const options = {
         maxSizeMB: 0.2,
         maxWidthOrHeight: 600,
         useWebWorker: true
       }
       try {
         const compressedFile = await imageCompression(imageFile, options);
         console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
         console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

         await readThenSendFile(compressedFile); //readin the compressed file
       } catch (error) {
         console.log(error);
         await readThenSendFile(imageFile); // if filetype is not image then sent orignal data without compression
       }

   });

   function readThenSendFile(data) {
     console.log(data)

     let user = localStorage.getItem('userName');
     console.log(user);

     //show progress msg
     $('#progress').fadeIn(100);

     var reader = new FileReader();
     reader.onload = function (evt) {
       var msg = {};
       msg.username = user;
       msg.file = evt.target.result;
       msg.fileName = data.name;
       msg.roomName = roomName;
       console.log(msg);
       console.log(data);
       socket.emit('Serverbase64File', msg);
     };
     reader.readAsDataURL(data);

     reader.onprogress = function (currentFile) {
       if (currentFile.lengthComputable) {
         var progress = parseInt(((currentFile.loaded / currentFile.total) * 100), 10);
         $('#percentage').html(progress);
         console.log(progress);
       }
     }
     reader.onerror = function () {
       alert("Could not read the file: large file size");
     };


   }

   socket.on('Clientbase64File', (data) => {
     console.log('read then');
     //appending data according to data types
     let filetype = data.fileName.split('.').pop();
     if (filetype == 'mp4' || filetype == 'ogg' || filetype == 'mkv') {
       $('#messages').append($('<li>').html(`<p class="username">${data.username}</p><video class="imgupload" src="${data.file}" height="400" width="400" controls/>`));
     } else if (filetype == 'mp3' || filetype == 'wav' || filetype == 'aac') {
       $('#messages').append($('<li>').html(`<p class="username">${data.username}</p><audio class="imgupload" src="${data.file}" height="400" width="400" controls/>`));
     } else {
       $('#messages').append($('<li>').html(`<p class="username">${data.username}</p><img class="imgupload" src="${data.file}" height="200" width="200" onclick="showimg(this)"/>`));
     }
   });
}
