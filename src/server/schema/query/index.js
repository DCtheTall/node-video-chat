const user = require('./user');
const { GraphQLObjectType } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user,
  },
});
