import { handleActions, combineActions } from 'redux-actions';
import { addError, clearError } from '../actions/error';

console.log(addError);

export default handleActions({
  [combineActions(addError, clearError)]: (state, { payload }) => payload,
}, '');
