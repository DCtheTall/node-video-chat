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
} from '../actions/call';


export default handleActions(
  {
    [combineActions(
      setCallStatusToAvailable,
      setCallStatusToTesting,
      setCallStatusToCalling,
      setCallStatusToCallFailed,
      setCallStatusToReceivingCall)]: (state, { payload }) => ({ ...state, status: payload }),
    [combineActions(
      setCallingContactId,
      clearCallingContactId)]: (state, { payload }) => ({ ...state, callingContactId: payload }),
    [combineActions(
      setCallingSocketId,
      clearCallingSocketId)]: (state, { payload }) => ({ ...state, callingSocketId: payload }),
  },
  {
    status: CallStatuses.Available,
    callingContactId: null,
    callingSocketId: null,
  },
);
