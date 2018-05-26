import { createActions } from 'redux-actions';
import Enum from 'enum';

import { CALL_REQUEST, CALL_CANCELED } from '../constants';
import { addError, clearError } from './error';
import socketModule from '../io';

export const CallStatuses = new Enum([
  'Available',
  'Testing',
  'Calling',
  'CallFailed',
  'ReceivingCall',
]);

export const {
  setCallStatusToAvailable,
  setCallStatusToTesting,
  setCallStatusToCalling,
  setCallStatusToCallFailed,
  setCallStatusToReceivingCall,
  setCallingContactId,
  setCallingSocketId,
} = createActions({
  SET_CALL_STATUS_TO_AVAILABLE: () => CallStatuses.Available,
  SET_CALL_STATUS_TO_TESTING: () => CallStatuses.Testing,
  SET_CALL_STATUS_TO_CALLING: () => CallStatuses.Calling,
  SET_CALL_STATUS_TO_CALL_FAILED: () => CallStatuses.CallFailed,
  SET_CALL_STATUS_TO_RECEIVING_CALL: () => CallStatuses.ReceivingCall,
  SET_CALLING_CONTACT_ID: payload => payload,
  SET_CALLING_SOCKET_ID: payload => payload,
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
 * @param {boolean} [callFailed=false] if the call cancel was due to not being able
 *                                     to reach the other user
 * @returns {function} thunk
 */
export function cancelCall(callFailed = false) {
  return async function innerCancelCall(dispatch, getState) {
    const socket = await getSocket();
    const { status, callingSocketId } = getState().call;
    if (status !== CallStatuses.Calling) return;
    if (callFailed) {
      dispatch(setCallStatusToCallFailed());
    } else {
      dispatch(setCallStatusToAvailable());
    }
    socket.emit(CALL_CANCELED, { toId: callingSocketId });
    dispatch(setCallingSocketId(null));
  };
}

/**
 * @param {number} contactId you are calling
 * @param {string} socketId of the user we are trying to reach
 * @returns {function} redux thunk
 */
export function startCall(contactId, socketId) {
  return async function innerStartCall(dispatch, getState) {
    const { status } = getState().call;
    const socket = await getSocket();
    if (status !== CallStatuses.Available) {
      dispatch(addError('You must end the current call to call another user!'));
      return;
    }
    dispatch(clearError());
    dispatch(setCallingContactId(contactId));
    dispatch(setCallingSocketId(socketId));
    dispatch(setCallStatusToCalling());
    socket.emit(CALL_REQUEST, { toId: socketId });
    setTimeout(() => dispatch(cancelCall(true)), 25e3);
  };
}

/**
 * @param {number} contactId of contact making call
 * @param {string} socketId of socket call is coming from
 * @returns {function} thunk
 */
export function receiveCall(contactId, socketId) {
  return function innerReceiveCall(dispatch, getState) {
    const { status } = getState().call;
    if (status !== CallStatuses.Available) {
      // TODO emit ignore call event
      return;
    }
    dispatch(clearError());
    dispatch(setCallingContactId(contactId));
    dispatch(setCallingSocketId(socketId));
    dispatch(setCallStatusToReceivingCall());
  };
}
