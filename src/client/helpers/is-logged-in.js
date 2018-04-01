/**
 * @param {Object} user object to test
 * @returns {boolean} if user is logged in
 */
export default function isLoggedIn(user) {
  return Boolean(user && user.id);
}
