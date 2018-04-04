import { GraphQLInt } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { Message } from '../../types';
import pubsub, { MESSAGE_CREATED } from '../pubsub';

export default {
  type: Message,
  name: 'MessageCreated',
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
    () => pubsub.asyncIterator(MESSAGE_CREATED),
    ({ threadId }, { forThreadId }) => {
      console.log('\n\n\n\n\n\n\n\n',forThreadId, threadId,'\n\n\n\n\n\n\n')
      return forThreadId === threadId
    },
  ),
};
