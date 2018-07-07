import { createActions } from 'redux-actions';
import Enum from 'enum';

import {
  CALL_REQUEST,
  CALL_CANCELED,
  CALL_IGNORED,
  CALL_ACCEPTED,
  ICE_CANDIDATE,
  ICE_DESCRIPTION,
  CALL_HANG_UP,
} from '../constants';
import { addError, clearError } from './error';
import socketModule from '../io';

export const CallStatuses = new Enum([
  'Available',
  'Testing',
  'Calling',
  'CallFailed',
  'ReceivingCall',
  'AcceptingCall',
  'InCall',
  'HangingUp',
]);

const isAvailable = status =>
  [CallStatuses.Available, CallStatuses.CallFailed].includes(status);

const canIgnoreCall = status =>
  [CallStatuses.ReceivingCall, CallStatuses.AcceptingCall].includes(status);

export const {
  setCallStatusToAvailable,
  setCallStatusToTesting,
  setCallStatusToCalling,
  setCallStatusToCallFailed,
  setCallStatusToReceivingCall,
  setCallStatusToAcceptingCall,
  setCallStatusToInCall,
  setCallStatusToHangingUp,

  setCallingContactId,
  clearCallingContactId,

  setCallingSocketId,
  clearCallingSocketId,

  setIceServerConfig,
  clearIceServerConfig,

  setRemoteDescription,
  clearRemoteDescription,

  setIceCandidate,
  clearIceCandidate,

  toggleVideoTrack,
  toggleAudioTrack,
} = createActions({
  SET_CALL_STATUS_TO_AVAILABLE: () => CallStatuses.Available,
  SET_CALL_STATUS_TO_TESTING: () => CallStatuses.Testing,
  SET_CALL_STATUS_TO_CALLING: () => CallStatuses.Calling,
  SET_CALL_STATUS_TO_CALL_FAILED: () => CallStatuses.CallFailed,
  SET_CALL_STATUS_TO_RECEIVING_CALL: () => CallStatuses.ReceivingCall,
  SET_CALL_STATUS_TO_ACCEPTING_CALL: () => CallStatuses.AcceptingCall,
  SET_CALL_STATUS_TO_IN_CALL: () => CallStatuses.InCall,
  SET_CALL_STATUS_TO_HANGING_UP: () => CallStatuses.HangingUp,

  SET_CALLING_CONTACT_ID: payload => payload,
  CLEAR_CALLING_CONTACT_ID: () => null,

  SET_CALLING_SOCKET_ID: payload => payload,
  CLEAR_CALLING_SOCKET_ID: () => null,

  SET_ICE_SERVER_CONFIG: payload => payload,
  CLEAR_ICE_SERVER_CONFIG: () => null,

  SET_REMOTE_DESCRIPTION: payload => payload,
  CLEAR_REMOTE_DESCRIPTION: () => null,

  SET_ICE_CANDIDATE: payload => payload,
  CLEAR_ICE_CANDIDATE: () => null,

  TOGGLE_VIDEO_TRACK: () => null,
  TOGGLE_AUDIO_TRACK: () => null,
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
 * Clear current session data
 * @param {function} dispatch action
 * @returns {undefined}
 */
function clearSessionData(dispatch) {
  dispatch(clearCallingContactId());
  dispatch(clearCallingSocketId());
  dispatch(clearIceServerConfig());
  dispatch(clearRemoteDescription());
  dispatch(clearIceCandidate());
}

/**
 * Emit hangup event to other person in the call
 * @returns {function} thunk
 */
export function emitHangup() {
  return async function innerEmitHangup(dispatch, getState) {
    const socket = await getSocket();
    const { callingSocketId } = getState().call;
    socket.emit(CALL_HANG_UP, { toId: callingSocketId });
    clearSessionData(dispatch);
  };
}

/**
 * Handle hangup from other person in call
 * @returns {function} thunk
 */
export function handleHangUp() {
  return function innerHandleHangup(dispatch) {
    dispatch(setCallStatusToHangingUp());
    clearSessionData(dispatch);
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
 * Handles when the called user accepts your call, peer connection
 * is created in the VideoChat container component
 * @returns {function} thunk
 */
export function handleCallAccepted(iceServerConfig) {
  return function innerHandleCallAccepted(dispatch, getState) {
    const { status } = getState().call;
    if (status !== CallStatuses.Calling) {
      dispatch(emitHangup());
      return;
    }
    dispatch(setIceServerConfig(iceServerConfig));
    dispatch(setCallStatusToAcceptingCall());
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
    if (!canIgnoreCall(status)) return;
    const socket = await getSocket();
    socket.emit(CALL_IGNORED, { toId: fromId || callingSocketId });
    dispatch(setCallStatusToAvailable());
    dispatch(clearCallingContactId());
    dispatch(clearCallingSocketId());
  };
}

/**
 * User accepts call from another user
 * @returns {function} thunk
 */
export function acceptCall() {
  return async function innerAcceptCall(dispatch, getState) {
    const socket = await getSocket();
    const { callingSocketId } = getState().call;
    socket.emit(CALL_ACCEPTED, { toId: callingSocketId });
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

/**
 * @param {Object} event data containing ICE candidate for peer connection
 * @returns {function} thunk
 */
export function handleIceCandidate(event) {
  return async function innerHandleIceCandidate(dispatch, getState) {
    if (!event.candidate) return;
    const { callingSocketId } = getState().call;
    const socket = await getSocket();
    socket.emit(ICE_CANDIDATE, {
      toId: callingSocketId,
      data: {
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      },
    });
  };
}

/**
 * @param {Object} description for session with peer
 * @returns {function} thunk
 */
export function sendSessionDescription(description) {
  return async function innerSendSessionDescription(dispatch, getState) {
    const socket = await getSocket();
    const { callingSocketId } = getState().call;
    socket.emit(ICE_DESCRIPTION, {
      toId: callingSocketId,
      description,
    });
  };
}
