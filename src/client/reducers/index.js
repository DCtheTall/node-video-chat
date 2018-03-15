import { combineReducers } from 'redux';
import { RESET_REDUX_STORE } from '../constants';
import error from './error';
import notice from './notice';
import contactRequests from './contact-requests';

const root = combineReducers({
  error,
  notice,
  contactRequests,
});

export default (state, action) => (
  action.type === RESET_REDUX_STORE ? undefined
                                    : root(state, action)
);
