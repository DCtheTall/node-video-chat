import { createActions } from 'redux-actions';

export const { addNotice, clearNotice } = createActions({
  ADD_NOTICE: String,
  CLEAR_NOTICE: () => '',
});
