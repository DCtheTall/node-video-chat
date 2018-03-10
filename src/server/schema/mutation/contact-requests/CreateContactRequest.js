import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';

const CreateContactRequestOutputType = new GraphQLObjectType({
  name: 'CreateContactRequestOutput',
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  },
});

export default {
  type: CreateContactRequestOutputType,
  name: 'CreateContactRequest',
  args: {
    userid: { type: GraphQLInt },
  },
  async resolve(parent, { userid }, req) {
    try {
      const [contactRequest, created] = await models.contact_request.findOrCreate({
        where: {
          sender_id: req.user.id,
          recipient_id: userid,
        },
      });
      if (!created && contactRequest.status !== 'expired') {
        return { success: false, message: 'You already sent that user a contact request' };
      }
      if (!created) {
        await contactRequest.destroy();
        await models.contact_request.create({
          sender_id: req.user.id,
          recipient_id: userid,
        });
      }
      return { success: true, message: 'Contact request sent!' };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'Something went wrong sending the contact request' };
    }
  },
};
