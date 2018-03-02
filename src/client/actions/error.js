import { createActions } from 'redux-actions';

export const { addError, clearError } = createActions({
  ADD_ERROR: error => String(error),
  CLEAR_ERROR: () => '',
});
