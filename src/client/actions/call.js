import { createActions } from 'redux-actions';
import Enum from 'enum';

import { addError } from './error';
import socketModule from '../socket';

export const CallStatuses = new Enum([
  'Available',
  'Testing',
]);

export const {
  setCallStatusToAvailable,
  setCallStatusToTesting,
} = createActions({
  SET_CALL_STATUS_TO_AVAILABLE: () => CallStatuses.Available,
  SET_CALL_STATUS_TO_TESTING: () => CallStatuses.Testing,
});

const getSocket = async () => (await socketModule).default();

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
export function startCall(socketId) {
  return async function innerEmitSocketPing() {
    const socket = await getSocket();
    // socket.emit('peer-msg', { toUser: socketId, peerId: socket.p2p.peerId });
  };
}
