import { combineActions, handleActions } from 'redux-actions';
import {
  CallStatuses,
  setCallStatusToAvailable,
  setCallStatusToTesting,
  setCallStatusToCalling,
  setCallStatusToCallFailed,
  setCallStatusToReceivingCall,
  setCallingContactId,
  setCallingSocketId,
} from '../actions/call';


export default handleActions(
  {
    [combineActions(
      setCallStatusToAvailable,
      setCallStatusToTesting,
      setCallStatusToCalling,
      setCallStatusToCallFailed,
      setCallStatusToReceivingCall)]: (state, { payload }) => ({ ...state, status: payload }),
    [setCallingContactId]: (state, { payload }) => ({ ...state, callingContactId: payload }),
    [setCallingSocketId]: (state, { payload }) => ({ ...state, callingSocketId: payload }),
  },
  {
    status: CallStatuses.Available,
    callingContactId: null,
    callingSocketId: null,
  },
);
