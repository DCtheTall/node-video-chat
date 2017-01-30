import {
  SET_STATUS,
  SET_SERVER,
  SET_STREAM,
  SET_PEER_STREAM,
  DISCONNECT,
  HANDLE_DISCONNECT,
} from './constants.js';

export const setStatus = status => ({ type: SET_STATUS, status });
export const setServer = server => ({ type: SET_SERVER, server });
export const setStream = stream => ({ type: SET_STREAM, stream });
export const setPeerStream = stream => ({ type: SET_PEER_STREAM, stream });
export const disconnect = () => ({ type: DISCONNECT });
export const handleDisconnect = () => ({ type: HANDLE_DISCONNECT });
