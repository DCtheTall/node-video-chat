import { GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { Contact } from '../types';

export default {
  type: new GraphQLList(Contact),
  name: 'Contacts',
  async resolve(parent, args, req) {
    const contacts = await models.contact.findAll({
      where: {
        [Op.or]: [
          { user_1: req.user && req.user.id },
          { user_2: req.user && req.user.id },
        ],
        blocker_id: null,
      },
      include: [
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
      ],
      order: [
        ['lastInteractedAt', 'DESC NULLS LAST'],
        ['createdAt', 'DESC'],
      ],
    });
    return contacts;
  },
};
