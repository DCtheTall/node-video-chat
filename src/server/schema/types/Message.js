import gql from 'graphql';
import User from './User';

export default new gql.GraphQLObjectType({
  name: 'Message',
  fields: {
    body: {
      type: gql.GraphQLString,
      resolve: message => message.body,
    },
    read: {
      type: gql.GraphQLBoolean,
      resolve: message => message.read,
    },
    sender: {
      type: User,
      resolve: message => (message.user1 || message.user2),
    },
  },
});
