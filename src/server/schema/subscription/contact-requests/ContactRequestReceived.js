import { GraphQLInt } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { CONTACT_REQUEST_CREATED } from '../pubsub/constants';
import pubsub from '../pubsub';
import { ContactRequest } from '../../types';

export default {
  type: ContactRequest,
  name: 'ContactRequestReceived',
  args: {
    userId: { type: GraphQLInt },
  },
  async resolve({ senderId, recipientId }) {
    try {
      const contactRequest = await models.contact_request.findOne({
        where: {
          sender_id: senderId,
          recipient_id: recipientId,
        },
        include: [{
          model: models.user,
          as: 'sender',
        }],
      });
      return contactRequest;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(CONTACT_REQUEST_CREATED),
    ({ recipientId }, { userId }) => userId === recipientId,
  ),
};
