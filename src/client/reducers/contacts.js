import { handleActions } from 'redux-actions';
import { setContactsQuery } from '../actions/contacts';

export default handleActions(
  {
    [setContactsQuery]: (state, { payload }) => ({ ...state, query: payload }),
  },
  { query: '' },
);
