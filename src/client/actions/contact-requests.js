import { createAction } from 'redux-actions';

// eslint-disable-next-line import/prefer-default-export
export const setContactRequestSearchQuery = createAction(
  'SET_CONTACT_REQUEST_SEARCH_QUERY',
  query => String(query || ''),
);
