import {
  CONNECTION,
  DISCONNECT,
  CALL_REQUEST,
  CALL_CANCELED,
  CALL_UNAVAILABLE,
  CALL_ACCEPTED,
  CALL_HANG_UP,
  ICE_SERVER_CONFIG,
  ICE_DESCRIPTION,
  ICE_CANDIDATE,
} from '../../constants';
import store from '../../store';
import {
  handleSocketDisconnect,
  receiveCall,
  handleCallCanceled,
  handleCallUnavailable,
  handleCallAccepted,
  setIceServerConfig,
  setRemoteDescription,
  setIceCandidate,
  handleHangUp,
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

  [CALL_HANG_UP]: () => {
    const { callingContactId } = store.getState().call;
    console.log(`Call ended by ${callingContactId}`);
    store.dispatch(handleHangUp());
  },

  [ICE_SERVER_CONFIG]: ({ iceServerConfig }) => {
    console.log('Received ICE server config');
    store.dispatch(setIceServerConfig(iceServerConfig));
  },

  [ICE_DESCRIPTION]: ({ description }) => {
    console.log('Received session description from peer');
    store.dispatch(setRemoteDescription(description));
  },

  [ICE_CANDIDATE]: ({ data }) => {
    console.log('ICE candidate received');
    store.dispatch(setIceCandidate({
      sdpMLineIndex: data.label,
      candidate: data.candidate,
    }));
  },
};

export default socket =>
  Object.keys(handlers).forEach(event =>
    socket.on(event, handlers[event]));
