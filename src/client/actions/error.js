import { createActions } from 'redux-actions';

export const { addError, clearError } = createActions({
  ADD_ERROR: String,
  CLEAR_ERROR: () => '',
});
