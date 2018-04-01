import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import User from './User';

export default new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: {
      type: GraphQLInt,
      resolve: message => message.id,
    },
    body: {
      type: GraphQLString,
      resolve: message => message.body,
    },
    read: {
      type: GraphQLBoolean,
      resolve: message => message.read,
    },
    senderId: {
      type: GraphQLInt,
      resolve: message => message.sender_id,
    },
    threadId: {
      type: GraphQLInt,
      resolve: message => message.thread_id,
    },
  },
});
