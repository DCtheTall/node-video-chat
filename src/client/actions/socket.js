import { addError } from './error';
import socketModule from '../socket';

/**
 * @returns {function} redux thunk
 */
export function handleSocketDisconnect() {
  return function innerHandleSocketDisconnect(dispatch, getState) {
    if (getState().token) {
      dispatch(addError('Connection interrupted. Please refresh the page.'));
    }
  };
}

/**
 * @param {string} socketId of the user we are trying to reach
 * @returns {function} redux thunk
 */
export function emitSocketPing(socketId) {
  return async function innerEmitSocketPing() {
    const { default: getSocket } = await socketModule;
    const socket = getSocket();
    socket.emit('peer-msg', { toUser: socketId, peerId: socket.p2p.peerId });
  };
}
