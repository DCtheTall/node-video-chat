import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

const IgnoreContactOutputType = new GraphQLObjectType({
  name: 'IgnoreContactRequestOutput',
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  },
});

export default {
  type: IgnoreContactOutputType,
  name: 'IgnoreContactRequest',
  args: {
    requestId: { type: GraphQLInt },
  },
  async resolve(parent, { requestId }) {
    try {
      const contactRequest = await models.contact_request.findOne({
        where: {
          id: requestId,
          status: models.contact_request.statuses.PENDING,
        },
      });
      if (!contactRequest) return { success: false, message: 'No such contact request' };
      contactRequest.status = models.contact_request.statuses.IGNORED;
      await contactRequest.save();
      return { success: true, message: 'Successfully ignored the contact request' };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'Something went wrong responding to the contact request' };
    }
  },
};
