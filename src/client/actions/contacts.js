import { createAction } from 'redux-actions';

// eslint-disable-next-line import/prefer-default-export
export const setContactsQuery = createAction(
  'SET_CONTACTS_SEARCH_QUERY',
  query => String(query || ''),
);
