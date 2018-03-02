import { addError, clearError } from './error';
import { login as apiLogin } from '../util/api';

/**
 * @param {Object}   args for fn
 * @param {string}   args.email for login attempt
 * @param {string}   args.password for login attempt
 * @param {function} args.refetch GraphQL data for container attempting login
 * @returns {undefined}
 */
export const login = ({ email, password, refetch }) => async (dispatch) => {
  try {
    dispatch(clearError());
    const data = await apiLogin({ email, password });
    if (data.success) return refetch();
    return dispatch(addError(data.message));
  } catch (err) {
    console.log(err);
    return dispatch(addError('Something went wrong logging you in'));
  }
};
