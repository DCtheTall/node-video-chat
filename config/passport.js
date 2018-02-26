const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

/**
 * @param {Object} models sequelize models
 * @returns {function} authentication callback for local strategy
 */
function createAuthentication(models) {
  return async function authenticateUser(req, email, password, done) {
    try {
      const user = await models.user.findOne({
        where: { email: { $iLike: email.trim() } },
      });
      if (user === null) return done(null, null);
      if (!(await user.validatePassword(password))) return done(null, {});
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  };
}

module.exports = function configurePassport(models) {
  passport.use(
    'local-login',
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    }, createAuthentication(models)),
  );

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email, done) => {
    try {
      const user = await models.user.findOne({ where: { email } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  return passport;
};
