import io from 'socket.io-client';
import connectP2P from './p2p';
import { handleSocketDisconnect } from '../actions/socket';

const socketEventHandlers = {
  connect() {
    console.log('Connection established with server');
  },
  disconnect(store) {
    console.log('Connect to the server terminated');
    store.dispatch(handleSocketDisconnect());
  },
};

const attachEventListeners = (socket, store) =>
  Object.keys(socketEventHandlers).map(event =>
    socket.on(event, socketEventHandlers[event].bind(null, store)));

const connect = token => io.connect(process.env.APP_URL, { query: `token=${token}` });

/**
 * @param {Object} store Redux store
 * @returns {Object} socket.io instance
 */
function connectSocket(store) {
  let { token } = store.getState();
  let socket = connect(token);
  attachEventListeners(socket, store);

  connectP2P(socket);

  store.subscribe(() => {
    const { token: newToken } = store.getState();
    if (newToken === token) return;
    if (socket) socket.disconnect();
    socket = null;
    if (newToken) socket = connect(newToken);
    if (socket) attachEventListeners(socket, store);
    token = newToken;
  });

  return socket;
}

export default connectSocket;
