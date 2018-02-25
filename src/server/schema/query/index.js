const { GraphQLObjectType } = require('graphql');
const currentUser = require('./current-user');
const user = require('./user');

module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: {
    currentUser,
    user,
  },
});
