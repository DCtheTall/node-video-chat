import { combineActions, handleActions } from 'redux-actions';
import {
  CallStatuses,
  setCallStatusToAvailable,
  setCallStatusToTesting,
  setCallStatusToCalling,
  setCallStatusToCallFailed,
  setCallStatusToReceivingCall,
  setCallingContactId,
  clearCallingContactId,
  setCallingSocketId,
  clearCallingSocketId,
  setIceServerConfig,
  clearIceServerConfig,
  setCallStatusToAcceptingCall,
  setRemoteDescription,
  clearRemoteDescription,
  setIceCandidate,
  clearIceCandidate,
} from '../actions/call';


export default handleActions(
  {
    [combineActions(
      setCallStatusToAvailable,
      setCallStatusToTesting,
      setCallStatusToCalling,
      setCallStatusToCallFailed,
      setCallStatusToReceivingCall,
      setCallStatusToAcceptingCall)]: (state, { payload }) => ({ ...state, status: payload }),

    [combineActions(
      setCallingContactId,
      clearCallingContactId)]: (state, { payload }) => ({ ...state, callingContactId: payload }),

    [combineActions(
      setCallingSocketId,
      clearCallingSocketId)]: (state, { payload }) => ({ ...state, callingSocketId: payload }),

    [combineActions(
      setIceServerConfig,
      clearIceServerConfig)]: (state, { payload }) => ({ ...state, iceServerConfig: payload }),

    [combineActions(
      setRemoteDescription,
      clearRemoteDescription)]: (state, { payload }) => ({ ...state, remoteDescription: payload }),

    [combineActions(
      setIceCandidate,
      clearIceCandidate)]: (state, { payload }) => ({ ...state, iceCandidate: payload }),
  },
  {
    status: CallStatuses.Available,
    callingContactId: null,
    callingSocketId: null,
    iceServerConfig: null,
    remoteDescription: null,
    iceCandidate: null,
  },
);
