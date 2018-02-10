import {
  SET_STATUS,
  SET_SERVER,
  SET_STREAM,
  SET_PEER_STREAM,
  DISCONNECT,
  HANDLE_DISCONNECT,
} from './constants.js';

const initialState = {
  status: 'prompting',
  server: null,
  stream: null,
  peerStream: null,
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case SET_STATUS:
      return Object.assign({}, state, { status: action.status });

    case SET_SERVER:
      return Object.assign({}, state, { server: action.server });

    case SET_STREAM:
      return Object.assign({}, state, { stream: action.stream });

    case SET_PEER_STREAM:
      return Object.assign({}, state, { peerStream: action.stream });

    case DISCONNECT:
      return Object.assign({}, state, {
        server: null,
        status: 'prompting',
      });

    case HANDLE_DISCONNECT:
      if (state.server === null) {
        return Object.assign({}, state, { status: 'prompting' });
      }
      return Object.assign({}, state, {
        status: 'disconnected',
        server: null,
      });

    default:
      return state;
  }
}
