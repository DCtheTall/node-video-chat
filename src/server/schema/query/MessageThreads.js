import { GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { MessageThread } from '../types';

export default {
  type: new GraphQLList(MessageThread),
  name: 'MessageThreads',
  async resolve(parent, args, req) {
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
    return threads;
  },
};
