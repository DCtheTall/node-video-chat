import { GraphQLBoolean } from 'graphql';

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
 } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLInt,
      description: 'the user\'s unique ID',
      resolve: user => user.id,
    },
    email: {
      type: GraphQLString,
      description: 'the user\'s email',
      resolve: user => user.email,
    },
  },
});
