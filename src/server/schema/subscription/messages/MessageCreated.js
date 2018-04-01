import { GraphQLInt } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { Message } from '../../types';
import pubsub, { MESSAGE_CREATED } from '../pubsub';

export default {
  type: Message,
  name: 'MessageCreated',
  args: {
    currentUserId: { type: GraphQLInt },
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
    ({ senderId, recipientId }, { currentUserId }) => (
      senderId === currentUserId || recipientId === currentUserId
    ),
  ),
};
