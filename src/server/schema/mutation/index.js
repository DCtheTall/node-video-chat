const { GraphQLObjectType } = require('graphql');
const LoginUser = require('./user/login-user');

module.exports = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    LoginUser,
  },
});
