import { GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { MessageThread } from '../types';

export default {
  type: new GraphQLList(MessageThread),
  name: 'MessageThreads',
  async resolve(parent, args, req) {
    try {
      const threads = await models.message_thread.findAll({
        where: {
          [Op.or]: [
            { user_1: req.user && req.user.id },
            { user_2: req.user && req.user.id },
          ],
        },
        order: [[{ model: models.message, as: 'messages' }, 'createdAt', 'DESC']],
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
            where: { id: req.user && { [Op.ne]: req.user.id } },
          },
          {
            model: models.user,
            as: 'user2',
            required: false,
            where: { id: req.user && { [Op.ne]: req.user.id } },
          },
          {
            model: models.message,
            as: 'messages',
          },
        ],
      });
      return threads.sort((a, b) => {
        const hasUnreadMessage = thread => (
          thread.messages[0]
          && thread.messages[0].sender_id !== req.user.id
          && !thread.messages[0].readAt
        );
        if (hasUnreadMessage(a) && hasUnreadMessage(b)) return 0;
        if (hasUnreadMessage(a)) return -1;
        if (hasUnreadMessage(b)) return 1;
        return 0;
      });
    } catch (err) {
      console.log(err);
      return [];
    }
  },
};
