import { GraphQLInt } from 'graphql';
import { MutationResponse } from '../../types';

export default {
  type: MutationResponse,
  name: 'AcceptContactRequest',
  args: {
    requestId: { type: GraphQLInt },
  },
  async resolve(parent, { requestId }, req) {
    try {
      const transaction = await models.sequelize.transaction();

      const contactRequest = await models.contact_request.findOne({
        where: {
          id: requestId,
          recipient_id: req.user && req.user.id,
          status: models.contact_request.statuses.PENDING,
        },
      });
      if (!contactRequest) return { success: false, message: 'No such contact request' };
      contactRequest.status = models.contact_request.statuses.ACCEPTED;
      await contactRequest.save({ transaction });

      await models.contact.create(
        {
          user_1: req.user.id,
          user_2: contactRequest.sender_id,
        },
        { transaction },
      );

      await transaction.commit();
      return { success: true, message: 'Contact request accepted' };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'Something went wrong responding to the contact request' };
    }
  },
};
