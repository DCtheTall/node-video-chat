/**
 * @param {Object} user object to test
 * @returns {boolean} if user is logged in
 */
export function isLoggedIn(user) {
  return Boolean(user && user.id);
}
