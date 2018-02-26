const passport = require('passport');

/**
 * loginUser
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @param {function} next callback
 * @returns {undefined}
 */
async function loginUser(req, res, next) {
  try {
    return passport.authenticate('local-login', (err, user) => {
      if (err) throw err;
      if (!user) return failureResponse({}, 'No such user')(res);
      if (!user.id) return failureResponse({}, 'Invalid password')(res);
      return req.login(user, () => successResponse()(res));
    })(req, res, next);
  } catch (err) {
    return errorResponse({}, 'There was a server error')(res);
  }
}

module.exports = loginUser;
