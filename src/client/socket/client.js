import io from 'socket.io-client';
import store from '../store';
import attachEventHandlers from './events';

const connect = token => io.connect(process.env.APP_URL, { query: `token=${token}` });

let { token } = store.getState();
let socket = connect(token);
attachEventHandlers(socket);

store.subscribe(() => {
  const { token: newToken } = store.getState();
  if (newToken === token) return;
  if (socket) socket.disconnect();
  socket = null;
  if (newToken) socket = connect(newToken);
  if (socket) attachEventHandlers(socket);
  token = newToken;
});

export default () => socket;
