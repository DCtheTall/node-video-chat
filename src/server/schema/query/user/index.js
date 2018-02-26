const User = require('../../types/user');

module.exports = {
  type: User,
  resolve: (_, args, req) => req.user,
};
