import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

const AcceptContactRequestResponse = new GraphQLObjectType({
  name: 'AcceptContactRequestResponse',
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    username: { type: GraphQLString },
  },
});

export default {
  type: AcceptContactRequestResponse,
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

      let contact = await models.contact.create(
        {
          user_1: req.user.id,
          user_2: contactRequest.sender_id,
        },
        { transaction }
      );
      await transaction.commit();

      contact = await models.contact.findById(contact.id, {
        include: [
          { model: models.user, as: 'user1' },
          { model: models.user, as: 'user2' },
        ],
      });

      return {
        success: true,
        username: contact.user2.username,
        message: 'Contact request accepted',
      };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'Something went wrong responding to the contact request' };
    }
  },
};
