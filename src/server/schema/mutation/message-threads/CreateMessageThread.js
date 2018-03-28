import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql';

export default {
  type: new GraphQLObjectType({
    name: 'CreateMessageThreadResponse',
    fields: {
      success: { type: GraphQLBoolean },
      message: { type: GraphQLString },
      threadId: { type: GraphQLInt },
    },
  }),
  name: 'CreateMessageThread',
  args: {
    contactId: { type: GraphQLInt },
  },
  async resolve(parent, { contactId }) {
    try {
      const contact = await models.contact.findById(contactId, { where: { blocker_id: null } });
      if (!contact) return { success: false, message: 'That contact is no longer reachable' };
      const thread = await models.message_thread.create({
        contact_id: contactId,
        user_1: contact.user_1,
        user_2: contact.user_2,
      });
      return { success: true, message: 'Success', threadId: thread.id };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'Something went wrong creating your message' };
    }
  },
};
