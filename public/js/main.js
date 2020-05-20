const chatForm = document.getElementById('chat-form');
const socket = io();

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log(username, room)


socket.on('message', message => {
    console.log(message);
    showMessage(message);
});



// Join the room
socket.emit('joinRoom', {username, room});

// Get room and users

// On message submit

  chatForm.addEventListener('submit', (e) => {
     e.preventDefault();

     const msg = e.target.elements.msg.value;

     socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

 });

 function showMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
 }




