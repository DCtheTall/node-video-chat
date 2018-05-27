import {
  CONNECTION,
  DISCONNECT,
  CALL_REQUEST,
  CALL_CANCELED,
  CALL_UNAVAILABLE,
  CALL_ACCEPTED,
  ICE_SERVER_CONFIG,
} from '../../constants';
import store from '../../store';
import {
  handleSocketDisconnect,
  receiveCall,
  handleCallCanceled,
  handleCallUnavailable,
  handleCallAccepted,
  setIceServerConfig,
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
  [CALL_ACCEPTED]: ({ iceServerConfig }) => {
    const { callingContactId } = store.getState().call;
    console.log(`Call request to ${callingContactId} accepted`);
    store.dispatch(setIceServerConfig(iceServerConfig));
    store.dispatch(handleCallAccepted());
  },
  [ICE_SERVER_CONFIG]: ({ iceServerConfig }) => {
    console.log('Received ICE server config');
    store.dispatch(setIceServerConfig(iceServerConfig));
  },
};

export default socket =>
  Object.keys(handlers).forEach(event =>
    socket.on(event, handlers[event]));
