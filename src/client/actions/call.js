import { createActions } from 'redux-actions';
import Enum from 'enum';

import {
  CALL_REQUEST,
  CALL_CANCELED,
  CALL_IGNORED,
} from '../constants';
import { addError, clearError } from './error';
import socketModule from '../io';

export const CallStatuses = new Enum([
  'Available',
  'Testing',
  'Calling',
  'CallFailed',
  'ReceivingCall',
]);

const isAvailable = status => [CallStatuses.Available, CallStatuses.CallFailed].includes(status);

export const {
  setCallStatusToAvailable,
  setCallStatusToTesting,
  setCallStatusToCalling,
  setCallStatusToCallFailed,
  setCallStatusToReceivingCall,
  setCallingContactId,
  clearCallingContactId,
  setCallingSocketId,
  clearCallingSocketId,
} = createActions({
  SET_CALL_STATUS_TO_AVAILABLE: () => CallStatuses.Available,
  SET_CALL_STATUS_TO_TESTING: () => CallStatuses.Testing,
  SET_CALL_STATUS_TO_CALLING: () => CallStatuses.Calling,
  SET_CALL_STATUS_TO_CALL_FAILED: () => CallStatuses.CallFailed,
  SET_CALL_STATUS_TO_RECEIVING_CALL: () => CallStatuses.ReceivingCall,
  SET_CALLING_CONTACT_ID: payload => payload,
  CLEAR_CALLING_CONTACT_ID: () => null,
  SET_CALLING_SOCKET_ID: payload => payload,
  CLEAR_CALLING_SOCKET_ID: () => null,
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
 * Cancel the call to another user
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
  };
}

/**
 * Handles when the called user is unavailable
 * @returns {function} thunk
 */
export function handleCallUnavailable() {
  return function innerHandleCallUnavailable(dispatch, getState) {
    const { status } = getState().call;
    if (status !== CallStatuses.Calling) return;
    dispatch(setCallStatusToCallFailed());
  };
}

/**
 * Start a call with another user
 * @param {number} contactId you are calling
 * @param {string} socketId of the user we are trying to reach
 * @returns {function} redux thunk
 */
export function startCall(contactId, socketId) {
  return async function innerStartCall(dispatch, getState) {
    const { status, callingSocketId } = getState().call;
    const socket = await getSocket();
    if (!isAvailable(status)) {
      if (socketId !== callingSocketId) {
        dispatch(addError('You must end the current call to call another user!'));
      }
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
 * Handler for the called when the caller cancels the call
 * @returns {function} thunk
 */
export function handleCallCanceled() {
  return function innerHandleCallCanceled(dispatch, getState) {
    const { status } = getState().call;
    if (status !== CallStatuses.ReceivingCall) return;
    dispatch(setCallStatusToAvailable());
    dispatch(clearCallingContactId());
    dispatch(clearCallingSocketId());
  };
}

/**
 * Called user ignores request from caller
 * @param {fromId} fromId optional parameter, specify which socket to ignore call from
 * @returns {function} thunk
 */
export function ignoreCall(fromId) {
  return async function innerIgnoreCall(dispatch, getState) {
    const { status, callingSocketId } = getState().call;
    if (status !== CallStatuses.ReceivingCall) return;
    const socket = await getSocket();
    socket.emit(CALL_IGNORED, { fromId: fromId || callingSocketId });
    dispatch(setCallStatusToAvailable());
    dispatch(clearCallingContactId());
    dispatch(clearCallingSocketId());
  };
}

/**
 * Handles when the client receives a call
 * @param {number} contactId of contact making call
 * @param {string} socketId of socket call is coming from
 * @returns {function} thunk
 */
export function receiveCall(contactId, socketId) {
  return function innerReceiveCall(dispatch, getState) {
    const { status } = getState().call;
    if (!isAvailable(status)) {
      // TODO? create a missed call subscription
      dispatch(ignoreCall(socketId));
      return;
    }
    dispatch(clearError());
    dispatch(setCallingContactId(contactId));
    dispatch(setCallingSocketId(socketId));
    dispatch(setCallStatusToReceivingCall());
  };
}
