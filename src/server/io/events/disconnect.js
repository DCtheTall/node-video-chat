import { USER_STATUS_CHANGE } from '../../schema/subscription/pubsub/constants';
import pubsub from '../../schema/subscription/pubsub';

/**
 * @param {Object} io socket.io instance
 * @param {Object} socket that disconnected
 * @returns {undefined}
 */
export default function handleDisconnect(io, socket) {
  if (!socket.decoded_token) return;
  console.log(`socket disconnected from user ${socket.decoded_token.id}`);
  pubsub.publish(USER_STATUS_CHANGE, { userId: socket.decoded_token.id });
}
