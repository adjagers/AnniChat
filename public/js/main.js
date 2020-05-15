const chatForm = document.getElementById('chat-form');
const socket = io();

socket.on('message', message => {
    console.log(message);
    showMessage(message);
});


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
    div.innerHTML = div.innerHTML = `<div class="message-content"><p class="meta"> Anton <span>9:22</span></p>
    <p class="text">
        ${message}
    </p></div>`;
    document.querySelector('.chat-messages').appendChild(div);
 }



