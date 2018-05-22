import {
  CONNECTION,
  DISCONNECT,
} from '../../constants';
import store from '../../store';
import { handleSocketDisconnect } from '../../actions/call';

const handlers = {
  [CONNECTION]: () => console.log('Connection established with server'),
  [DISCONNECT]: () => {
    console.log('Connect to the server terminated');
    store.dispatch(handleSocketDisconnect());
  },
};

export default socket =>
  Object.keys(handlers).forEach(event =>
    socket.on(event, handlers[event]));
