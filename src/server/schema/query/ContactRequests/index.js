import { GraphQLList } from 'graphql';
import Promise from 'bluebird';
import moment from 'moment';
import ContactRequest from '../../types/ContactRequest';

export default {
  type: new GraphQLList(ContactRequest),
  name: 'ContactRequests',
  async resolve(parent, args, req) {
    try {
      const pendingRequests = await models.contact_request.findAll({
        where: {
          recipient_id: req.user.id,
          status: 'pending',
        },
        include: [{
          model: models.user,
          as: 'sender',
        }],
        order: [['createdAt', 'DESC']],
        limit: 100,
      });
      await Promise.map(pendingRequests, async (request) => {
        if (moment(request.createdAt) < moment().startOf('day').subtract(1, 'month')) {
          request.status = 'expired';
          await request.save();
        }
      });
      return pendingRequests;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
};
