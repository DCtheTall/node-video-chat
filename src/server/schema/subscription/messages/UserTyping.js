import { GraphQLInt, GraphQLBoolean } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import pubsub, { USER_TYPING } from '../pubsub';

export default {
  type: GraphQLBoolean,
  name: 'UserTyping',
  args: {
    currentlyMessagingUser: { type: GraphQLInt },
  },
  resolve: () => true,
  subscribe: withFilter(
    () => pubsub.asyncIterator(USER_TYPING),
    ({ userTyping }, { currentlyMessagingUser }) =>
      userTyping === currentlyMessagingUser,
  ),
};
