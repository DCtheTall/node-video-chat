import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import moment from 'moment';

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
    shortenedBody: {
      type: GraphQLString,
      resolve: message => (
        message.body.length > 55 ?
          `${message.body.slice(0, 55).trim()}...`
          : message.body
      ),
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
    readAt: {
      type: GraphQLString,
      resolve: message => message.readAt && moment(message.readAt).toISOString(),
    },
    createdAt: {
      type: GraphQLString,
      resolve: message => moment(message.createdAt).toISOString(),
    },
  },
});
