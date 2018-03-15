import { GraphQLList, GraphQLString } from 'graphql';
import Sequelize, { Op } from 'sequelize';
import User from '../../types/User';

export default {
  type: new GraphQLList(User),
  name: 'Users',
  args: {
    query: { type: GraphQLString },
  },
  async resolve(parent, { query }, req) {
    if (!query) return [];
    try {
      const iLikeQuery = { $iLike: `%${query}%` };
      const users = await models.user.findAll({
        where: {
          id: { [Op.not]: req.user && req.user.id },
          [Op.or]: [
            { email: iLikeQuery },
            { username: iLikeQuery },
          ],
          [Op.and]: [
            {
              [Op.or]: [
                Sequelize.literal('"contactRequestsReceived".status IS NULL'),
                Sequelize.literal('"contactRequestsReceived".status = \'expired\''),
              ],
            },
            {
              [Op.or]: [
                Sequelize.literal('"contactRequestsSent".status IS NULL'),
                Sequelize.literal('"contactRequestsSent".status = \'expired\''),
                Sequelize.literal('"contactRequestsSent".status = \'ignored\''),
              ],
            },
          ],
        },
        include: [
          {
            model: models.contact_request,
            as: 'contactRequestsReceived',
            required: false,
            where: {
              sender_id: req.user && req.user.id,
            },
          },
          {
            model: models.contact_request,
            as: 'contactRequestsSent',
            required: false,
            where: {
              recipient_id: req.user && req.user.id,
            },
          },
        ],
        order: [['username', 'ASC']],
      });
      return users;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
};
