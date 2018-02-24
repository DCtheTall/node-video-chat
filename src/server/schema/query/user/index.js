const {
  GraphQLNonNull,
  GraphQLInt,
} = require('graphql');
const User = require('../../types/user');

module.exports = {
  type: User,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: (root, { id }) => models.user.findById(id),
};
