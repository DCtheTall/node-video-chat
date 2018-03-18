import { handleActions } from 'redux-actions';
import { setToken } from '../actions/token';

export default handleActions({
  [setToken]: (state, { payload }) => payload,
}, '');
