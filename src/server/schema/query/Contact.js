import { GraphQLInt } from 'graphql';
import { Op } from 'sequelize';
import { Contact } from '../types';

export default {
  type: Contact,
  name: 'Contact',
  args: {
    contactId: { type: GraphQLInt },
  },
  async resolve(parent, { contactId }, req) {
    try {
      const contact = await models.contact.findById(contactId, {
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
      });
      return contact;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
