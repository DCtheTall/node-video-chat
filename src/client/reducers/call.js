import { combineActions, handleActions } from 'redux-actions';
import {
  CallStatuses,
  setCallStatusToAvailable,
  setCallStatusToTesting,
  setCallStatusToCalling,
  setCallingContactId,
} from '../actions/call';


export default handleActions(
  {
    [combineActions(
      setCallStatusToAvailable,
      setCallStatusToTesting,
      setCallStatusToCalling)]: (state, { payload }) => ({ ...state, status: payload }),
    [setCallingContactId]: (state, { payload }) => ({ ...state, callingContactId: payload }),
  },
  {
    status: CallStatuses.Available,
    callingContactId: null,
  }
);
