import {
  CONNECTION,
  DISCONNECT,
  CALL_RECEIVED,
} from '../../constants';
import store from '../../store';
import {
  handleSocketDisconnect,
  receiveCall,
} from '../../actions/call';

const handlers = {
  [CONNECTION]: () => console.log('Connection established with server'),
  [DISCONNECT]: () => {
    console.log('Connect to the server terminated');
    store.dispatch(handleSocketDisconnect());
  },
  [CALL_RECEIVED]: ({ fromId, contactId }) => {
    console.log(`Receiving call from contact ${contactId}`);
    store.dispatch(receiveCall(contactId, fromId));
  },
};

export default socket =>
  Object.keys(handlers).forEach(event =>
    socket.on(event, handlers[event]));
