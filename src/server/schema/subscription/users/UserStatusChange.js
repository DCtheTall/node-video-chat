import { GraphQLList, GraphQLInt } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { USER_STATUS_CHANGE } from '../pubsub/constants';
import { User } from '../../types';
import pubsub from '../pubsub';

export default {
  name: 'UserStatusChange',
  type: User,
  args: {
    userIds: { type: new GraphQLList(GraphQLInt) },
  },
  async resolve({ userId }) {
    const user = await models.user.findById(userId);
    return user;
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(USER_STATUS_CHANGE),
    ({ userId }, { userIds }) => userIds.includes(userId),
  ),
};
