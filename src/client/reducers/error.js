import { handleActions, combineActions } from 'redux-actions';
import { addError, clearError } from '../actions/error';

export default handleActions({
  [combineActions(addError, clearError)]: (state, { payload }) => payload,
}, '');
