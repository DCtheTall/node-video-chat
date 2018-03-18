import { handleActions, combineActions } from 'redux-actions';
import { setToken, clearToken } from '../actions/token';

export default handleActions({
  [combineActions(setToken, clearToken)]: (state, { payload }) => payload,
}, '');
