import { createActions } from 'redux-actions';
import Enum from 'enum';

import { CALL_REQUEST } from '../constants';
import { addError, clearError } from './error';
import socketModule from '../socket';

export const CallStatuses = new Enum([
  'Available',
  'Testing',
  'Calling',
]);

export const {
  setCallStatusToAvailable,
  setCallStatusToTesting,
  setCallStatusToCalling,
  setCallingContactId,
} = createActions({
  SET_CALL_STATUS_TO_AVAILABLE: () => CallStatuses.Available,
  SET_CALL_STATUS_TO_TESTING: () => CallStatuses.Testing,
  SET_CALL_STATUS_TO_CALLING: () => CallStatuses.Calling,
  SET_CALLING_CONTACT_ID: payload => payload,
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
 * @param {number} contactId you are calling
 * @param {string} socketId of the user we are trying to reach
 * @returns {function} redux thunk
 */
export function startCall(contactId, socketId) {
  return async function innerEmitSocketPing(dispatch) {
    const socket = await getSocket();
    dispatch(clearError());
    dispatch(setCallingContactId(contactId));
    dispatch(setCallStatusToCalling());
    socket.emit(CALL_REQUEST, { toUser: socketId });
  };
}
