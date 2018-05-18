import { combineActions, handleActions } from 'redux-actions';
import {
  CallStatuses,
  setCallStatusToAvailable,
  setCallStatusToTesting,
} from '../actions/call';


export default handleActions(
  {
    [combineActions(
      setCallStatusToAvailable,
      setCallStatusToTesting)]: (state, { payload }) => ({ ...state, status: payload }),
  },
  { status: CallStatuses.Available }
);
