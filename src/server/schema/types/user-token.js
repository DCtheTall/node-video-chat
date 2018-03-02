const { GraphQLObjectType, GraphQLString } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'UserToken',
  fields: {
    token: {
      type: GraphQLString,
      resolve: userToken => userToken.token,
    },
    message: {
      type: GraphQLString,
      resolve: userToken => userToken.message,
    },
  },
});
