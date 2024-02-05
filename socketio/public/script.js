const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const roomForm = document.getElementById('room-form');
const roomInput = document.getElementById('room-input');
const typingIndicator = document.getElementById('typing-indicator');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value;
  const room = roomInput.value;
  if (message && room) {
    socket.emit('chat message', { message, nickname: socket.nickname, room });
    input.value = '';
  }
});

// ...

// Handle joining a room
roomForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const roomInput = document.getElementById('room-input');
  const roomName = roomInput.value.trim();

  if (roomName) {
    socket.emit('join room', roomName);
    roomInput.value = '';
  }
});

// Listen for the 'room joined' event
socket.on('room joined', (message) => {
  const item = document.createElement('li');
  item.textContent = message;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// ...


input.addEventListener('input', () => {
  socket.emit('typing');
});

socket.on('typing', (user) => {
  typingIndicator.textContent = `${user} is typing...`;
  setTimeout(() => {
    typingIndicator.textContent = '';
  }, 2000);
});

socket.on('chat message', (msg) => {
  const { message, nickname, timestamp } = msg;
  const item = document.createElement('li');
  item.textContent = `[${timestamp}] ${nickname}: ${message}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('private message', (data) => {
  const { message, sender } = data;
  const item = document.createElement('li');
  item.textContent = `[Private from ${sender}] ${message}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user disconnected', (nickname) => {
  const item = document.createElement('li');
  item.textContent = `${nickname} has disconnected.`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
