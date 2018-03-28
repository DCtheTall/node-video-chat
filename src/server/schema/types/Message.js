import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import User from './User';

export default new GraphQLObjectType({
  name: 'Message',
  fields: {
    body: {
      type: GraphQLString,
      resolve: message => message.body,
    },
    read: {
      type: GraphQLBoolean,
      resolve: message => message.read,
    },
    sender: {
      type: User,
      resolve: message => (message.user1 || message.user2),
    },
  },
});
