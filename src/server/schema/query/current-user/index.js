const User = require('../../types/user');

module.exports = {
  type: User,
  resolve: ({ req }) => models.user.findById(req.user && req.user.id),
};
