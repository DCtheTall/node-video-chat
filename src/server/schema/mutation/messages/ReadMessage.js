import { GraphQLInt } from 'graphql';
import { Op } from 'sequelize';
import { MutationResponse } from '../../types';
import pubsub, { MESSAGE_READ } from '../../subscription/pubsub';

export default {
  name: 'ReadMessage',
  type: MutationResponse,
  args: {
    messageId: { type: GraphQLInt },
  },
  async resolve(parent, { messageId }, req) {
    try {
      const message = await models.message.findOne({
        where: {
          id: messageId,
          readAt: null,
          sender_id: { [Op.ne]: req.user.id },
        },
      });
      if (!message) return { success: false };
      message.readAt = new Date();
      await message.save();
      pubsub.publish(MESSAGE_READ, {
        messageId: message.id,
        threadId: message.thread_id,
      });
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  },
};
