import { GraphQLInt } from 'graphql';
import { Op } from 'sequelize';
import { MutationResponse } from '../../types';

export default {
  name: 'ReadMessage',
  type: MutationResponse,
  args: {
    messageId: { type: GraphQLInt },
  },
  async resolve(parent, { messageId }, req) {
    try {
      await models.message.update(
        { readAt: (new Date()).toISOString() },
        {
          where: {
            id: messageId,
            readAt: null,
            sender_id: { [Op.ne]: req.user.id },
          },
        },
      );
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  },
};
