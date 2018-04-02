import { GraphQLInt } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { Message } from '../../types';
import pubsub, { MESSAGE_READ } from '../pubsub';

export default {
  name: 'MessageRead',
  type: Message,
  args: {
    forThreadId: { type: GraphQLInt },
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
    () => pubsub.asyncIterator(MESSAGE_READ),
    ({ threadId }, { forThreadId }) => (threadId === forThreadId)
  ),
};
