import { GraphQLInt, GraphQLString } from 'graphql';
import { MutationResponse } from '../../types';
import pubsub, { MESSAGE_CREATED } from '../../subscription/pubsub';

export default {
  type: MutationResponse,
  name: 'CreateMessageResponse',
  args: {
    threadId: { type: GraphQLInt },
    body: { type: GraphQLString },
  },
  async resolve(parent, { threadId, body }, req) {
    try {
      const thread = await models.message_thread.findById(threadId);
      if (!thread) throw new Error(`No message thread with id: ${threadId}`);
      let message;
      await models.sequelize.transaction(async (transaction) => {
        message = await models.message.create(
          {
            body,
            thread_id: threadId,
            sender_id: req.user.id,
            recipient_id: thread.user_1 === req.user.id ? thread.user_2 : thread.user_1,
          },
          { transaction }
        );
        thread.lastMessageAt = new Date();
        await thread.save({ transaction });
        await models.contact.update(
          { lastInteractedAt: new Date() },
          { where: { id: thread.contact_id }, transaction },
        );
      });
      pubsub.publish(MESSAGE_CREATED, {
        user1: message.sender_id,
        user2: message.recipient_id,
        messageId: message.id,
      });
      return { success: true, message: 'Message sent' };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'Something went wrong sending your message' };
    }
  },
};
