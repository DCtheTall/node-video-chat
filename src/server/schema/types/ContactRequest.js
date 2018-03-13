import {
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql';
import User from './User';

export default new GraphQLObjectType({
  name: 'ContactRequest',
  fields: {
    id: {
      type: GraphQLInt,
      description: 'the request\'s unique ID',
      resolve: request => request.id,
    },
    sender: {
      type: User,
      description: 'the user who send the request',
      resolve: request => request.sender,
    },
    recipient: {
      type: User,
      description: 'the user who received the request',
      resolve: request => request.recipient,
    },
  },
});
