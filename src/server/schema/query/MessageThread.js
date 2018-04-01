import { GraphQLInt } from 'graphql';
import { Op } from 'sequelize';
import { MessageThread } from '../types';

export default {
  type: MessageThread,
  name: 'MessageThread',
  args: {
    threadId: { type: GraphQLInt },
  },
  async resolve(parent, { threadId }, req) {
    const notCurrentUser = () => ({ id: req.user && { [Op.ne]: req.user.id } });

    const thread = await models.message_thread.findOne({
      where: {
        id: threadId,
        [Op.or]: [
          { user_1: req.user && req.user.id },
          { user_2: req.user && req.user.id },
        ],
      },
      include: [
        {
          model: models.contact,
          as: 'contact',
          where: { blocker_id: null },
        },
        {
          model: models.user,
          as: 'user1',
          required: false,
          where: notCurrentUser(),
        },
        {
          model: models.user,
          as: 'user2',
          required: false,
          where: notCurrentUser(),
        },
        {
          model: models.message,
          as: 'messages',
          include: [
            {
              model: models.user,
              as: 'sender',
              attributes: ['id'],
            },
          ],
        },
      ],
    });
    return thread;
  },
};
