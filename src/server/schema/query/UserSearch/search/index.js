import { NEW_CONTACT_REQUEST } from '../constants';
import newContactRequestSearch from './new-contact-request';

/**
 * @param {Express.Request} req the request
 * @param {string} query the search query
 * @param {string} searchType type of search being executed
 * @returns {Array<Object>} user instances
 */
export default function getSearchWhereParams(req, query, searchType) {
  switch (searchType) {
    case NEW_CONTACT_REQUEST:
      return newContactRequestSearch(req, query);
    default:
      return [];
  }
}
