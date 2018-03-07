import { GraphQLList, GraphQLString } from 'graphql';
import User from '../../types/User';

export default {
  type: new GraphQLList(User),
  name: 'Users',
  args: {
    query: { type: GraphQLString },
  },
  async resolve(parent, { query }, req) {
    if (!query) return [];
    const iLikeQuery = { $iLike: `%${query}%` };
    const users = await models.user.findAll({
      where: {
        id: { $not: req.user.id },
        $or: [
          { email: iLikeQuery },
          { username: iLikeQuery },
        ],
      },
      limit: 25,
      include: [{
        model: models.contact_request,
        as: 'contactRequestsSent',
      }],
    });
    return users;
  },
};
