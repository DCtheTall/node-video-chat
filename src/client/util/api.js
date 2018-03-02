import axios from 'axios';

const LOGIN_API_ROUTE = '/api/login';

/**
 * @param {Object}   args for fn
 * @param {string}   args.email for login attempt
 * @param {string}   args.password for login attempt
 * @returns {Promise<Object>} response from login api call
 */
export async function login({ email, password }) {
  const { data } = await axios.post(LOGIN_API_ROUTE, { email, password });
  return data;
}
