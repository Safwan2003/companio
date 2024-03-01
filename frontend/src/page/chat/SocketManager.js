// client/src/SocketManager.js
import io from 'socket.io-client';

const socket = io('http://localhost:2000');

const connect = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

const disconnect = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

const getSocket = () => {
  return socket;
};

export default { connect, disconnect, getSocket };
