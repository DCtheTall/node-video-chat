import { combineReducers } from 'redux';
import { RESET_REDUX_STORE } from '../constants';
import error from './error';
import notice from './notice';
import contactRequests from './contact-requests';
import token from './token';

const root = combineReducers({
  error,
  notice,
  contactRequests,
  token,
});

export default (state, action) => (
  root(action.type === RESET_REDUX_STORE ? undefined : state, action)
);
