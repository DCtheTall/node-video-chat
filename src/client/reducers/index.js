import { combineReducers } from 'redux';
import { RESET_REDUX_STORE } from '../constants';
import error from './error';
import notice from './notice';
import contactRequests from './contact-requests';
import token from './token';
import contacts from './contacts';
import call from './call';

const root = combineReducers({
  error,
  notice,
  contactRequests,
  token,
  contacts,
  call,
});

export default (state, action) => (
  root(action.type === RESET_REDUX_STORE ? undefined : state, action)
);
