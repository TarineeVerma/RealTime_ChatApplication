const socket = io();

let messageArea = document.querySelector('#message_area');
let uname;

let textarea = document.querySelector('#textarea');
do {
  uname = prompt('Please Enter your Name: ');
} while (!uname);

textarea.addEventListener('keyup', (e) => {
  if (e.key == 'Enter') {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    user: uname,
    message: message.trim()
  };

  appendMessage(msg, 'outgoing');
  textarea.value = '';
  ScrollToBottom();

  socket.emit('message', msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement('div');
  let className = type;
  mainDiv.classList.add(className, 'message');

  let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
  `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('message', { user: 'System', message: `${uname} has connected.` });
});

socket.on('message', (msg) => {
  appendMessage(msg, 'incoming');
  ScrollToBottom();
});



socket.on('disconnect', () => {
  console.log('Disconnected from server')
});


function ScrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
