import { GraphQLInt, GraphQLString } from 'graphql';
import { MutationResponse } from '../../types';

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
      await models.message.create({
        body,
        thread_id: threadId,
        sender_id: req.user.id,
        recipient_id: thread.user_1 === req.user.id ? thread.user_2 : thread.user_1,
        read: false,
      });
      return { success: true, message: 'Message sent' };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'Something went wrong sending your message' };
    }
  },
};
