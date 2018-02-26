import axios from 'axios';

const LOGIN_API_ROUTE = '/api/login';

/**
 * @param {Object}   args for fn
 * @param {string}   args.email for login attempt
 * @param {string}   args.password for login attempt
 * @param {function} args.refetch GraphQL data for container attempting login
 * @returns {undefined}
 */
export async function login({ email, password, refetch }) {
  try {
    const { data } = await axios.post(LOGIN_API_ROUTE, { email, password });
    console.log(data.message);
    if (data.success) refetch();
  } catch (err) {
    // TODO add to error display with redux
    console.log(err);
  }
}
