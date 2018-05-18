import io from 'socket.io-client';
import { handleSocketDisconnect } from '../actions/call';
import store from '../store';

const socketEventHandlers = {
  connect() {
    console.log('Connection established with server');
  },
  disconnect() {
    console.log('Connect to the server terminated');
    store.dispatch(handleSocketDisconnect());
  },
  sendPeerId(data) {
    console.log(data);
  },
};

const attachEventListeners = socket =>
  Object.keys(socketEventHandlers).map(event =>
    socket.on(event, socketEventHandlers[event]));

const connect = token => io.connect(process.env.APP_URL, { query: `token=${token}` });


let { token } = store.getState();
let socket = connect(token);
attachEventListeners(socket, store);


store.subscribe(() => {
  const { token: newToken } = store.getState();
  if (newToken === token) return;
  if (socket) socket.disconnect();
  socket = null;
  if (newToken) socket = connect(newToken);
  if (socket) attachEventListeners(socket, store);
  token = newToken;
});

export default () => socket;
