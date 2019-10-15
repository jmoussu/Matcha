import clientSocket from 'socket.io-client';

let _socket = null;

function getSocket() {
  if (_socket === null) {
    _socket = clientSocket('http://localhost:3001/');
  }
  return _socket;
}

export function connect() {
  return getSocket();
}

const socket = getSocket();

export default socket;
