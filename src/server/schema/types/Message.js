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
    sender: {
      type: User,
      resolve: message => message.sender,
    },
  },
});
