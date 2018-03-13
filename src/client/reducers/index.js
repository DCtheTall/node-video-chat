import { combineReducers } from 'redux';
import error from './error';
import notice from './notice';
import contactRequests from './contact-requests';

export default combineReducers({
  error,
  notice,
  contactRequests,
});
