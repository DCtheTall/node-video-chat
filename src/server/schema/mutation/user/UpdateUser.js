import { GraphQLString } from 'graphql';
import { MutationResponse } from '../../types';

export default {
  type: MutationResponse,
  name: 'UpdateUser',
  args: {
    newEmail: { type: GraphQLString },
    newUsername: { type: GraphQLString },
  },
  async resolve(parent, { newEmail, newUsername }, req) {
    try {
      if (newEmail) req.user.email = newEmail;
      if (newUsername) req.user.username = newUsername;
      await req.user.save();
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  },
};
