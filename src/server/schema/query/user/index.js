const User = require('../../types/user');
const { GraphQLInt } = require('graphql');

module.exports = {
  type: User,
  args: {
    id: { type: GraphQLInt },
  },
  resolve: (_, args) => models.user.findById(args.id),
};
