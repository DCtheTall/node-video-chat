import { GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { Contact } from '../types';

export default {
  type: new GraphQLList(Contact),
  name: 'Contacts',
  async resolve(parent, args, req) {
    let contacts = await models.contact.findAll({
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
          where: { id: req.user && { $ne: req.user.id } },
        },
        {
          model: models.user,
          as: 'user2',
          required: false,
          where: { id: req.user && { $ne: req.user.id } },
        },
      ],
    });
    contacts = contacts.map((contact) => {
      contact.user = contact.user1 || contact.user2;
      return contact;
    });
    contacts = contacts.sort((contactA, contactB) => {
      if (contactA.user.username < contactB.user.username) return -1;
      if (contactA.user.username > contactB.user.username) return 1;
      return 0;
    });
    return contacts;
  },
};
