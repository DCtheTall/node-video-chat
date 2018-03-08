import { handleActions } from 'redux-actions';
import { setContactRequestSearchQuery } from '../actions/contact-requests';

export default handleActions(
  {
    [setContactRequestSearchQuery]: (state, { payload }) => ({ ...state, query: payload }),
  },
  { query: '' },
);
