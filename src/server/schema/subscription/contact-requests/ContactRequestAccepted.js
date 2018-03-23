import { GraphQLInt } from 'graphql';
import { Op } from 'sequelize';
import { withFilter } from 'graphql-subscriptions';
import { CONTACT_REQUEST_ACCEPTED } from '../pubsub/constants';
import { Contact } from '../../types';
import pubsub from '../pubsub';

export default {
  type: Contact,
  name: 'ContactRequestAccepted',
  args: {
    userId: { type: GraphQLInt },
  },
  async resolve({ user1, user2 }, { userId }) {
    console.log('\n\n\n\n\n\n\nhello\n\n\n\n\n\n')
    try {
      const contact = await models.contact.findOne({
        where: {
          user_1: user1,
          user_2: user2,
        },
        include: [
          {
            model: models.user,
            as: 'user1',
            required: false,
            where: {
              id: { [Op.ne]: userId },
            },
          },
          {
            model: models.user,
            as: 'user2',
            required: false,
            where: {
              id: { [Op.ne]: userId },
            },
          },
        ],
      });
      contact.user = contact.user1 || contact.user2;
      return contact;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(CONTACT_REQUEST_ACCEPTED),
    ({ user2 }, { userId }) => user2 === userId,
  ),
};
