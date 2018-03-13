import { handleActions, combineActions } from 'redux-actions';
import { addNotice, clearNotice } from '../actions/notice';

export default handleActions({
  [combineActions(addNotice, clearNotice)]: (state, { payload }) => payload,
}, '');
