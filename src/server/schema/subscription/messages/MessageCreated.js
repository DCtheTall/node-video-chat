import { GraphQLInt } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { Message } from '../../types';
import pubsub, { MESSAGE_CREATED } from '../pubsub';

export default {
  type: Message,
  name: 'MessageCreated',
  args: {
    forUserId: { type: GraphQLInt },
  },
  async resolve({ messageId }) {
    try {
      const message = await models.message.findById(messageId);
      return message;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(MESSAGE_CREATED),
    ({ user1, user2 }, { forUserId }) => (forUserId === user1 || forUserId === user2),
  ),
};
