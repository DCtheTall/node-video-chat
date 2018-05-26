import {
  CONNECTION,
  DISCONNECT,
  CALL_REQUEST,
  CALL_CANCELED,
  CALL_UNAVAILABLE,
} from '../../constants';
import store from '../../store';
import {
  handleSocketDisconnect,
  receiveCall,
  handleCallCanceled,
  handleCallUnavailable,
} from '../../actions/call';

const handlers = {
  [CONNECTION]: () => console.log('Connection established with server'),
  [DISCONNECT]: () => {
    console.log('Connect to the server terminated');
    store.dispatch(handleSocketDisconnect());
  },
  [CALL_REQUEST]: ({ fromId, contactId }) => {
    console.log(`Receiving call from contact ${contactId}`);
    store.dispatch(receiveCall(contactId, fromId));
  },
  [CALL_CANCELED]: () => {
    const { callingContactId } = store.getState().call;
    console.log(`Call from contact ${callingContactId} canceled`);
    store.dispatch(handleCallCanceled());
  },
  [CALL_UNAVAILABLE]: () => {
    const { callingContactId } = store.getState().call;
    console.log(`Contact ${callingContactId} is not available`);
    store.dispatch(handleCallUnavailable());
  },
};

export default socket =>
  Object.keys(handlers).forEach(event =>
    socket.on(event, handlers[event]));
