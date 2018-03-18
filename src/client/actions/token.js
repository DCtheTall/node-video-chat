import { createActions } from 'redux-actions';

export const { setToken, clearToken } = createActions({
  SET_TOKEN: token => String(token),
  CLEAR_TOKEN: () => '',
});
