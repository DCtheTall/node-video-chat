import { combineReducers } from 'redux';
import error from './error';
import contactRequests from './contact-requests';

export default combineReducers({
  error,
  contactRequests,
});
