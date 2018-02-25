const User = require('../../types/user');

module.exports = {
  type: User,
  resolve: (_, args, { user }) => (user || null),
};
