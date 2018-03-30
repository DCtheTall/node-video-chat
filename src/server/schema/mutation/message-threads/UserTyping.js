import { MutationResponse } from '../../types';
import pubsub, { USER_TYPING } from '../../subscription/pubsub';

export default {
  type: MutationResponse,
  name: 'UserTypingResponse',
  resolve(parent, { userTyping }, req) {
    try {
      pubsub.publish(USER_TYPING, { userTyping: req.user && req.user.id });
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  },
};
