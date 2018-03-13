import { createActions } from 'redux-actions';

export const { addNotice, clearNotice } = createActions({
  ADD_NOTICE: message => String(message),
  CLEAR_NOTICE: () => '',
});
