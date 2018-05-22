import pubsub from '../../schema/subscription/pubsub';
import { USER_STATUS_CHANGE } from '../../schema/subscription/pubsub/constants';

/**
 * @param {Object} socket that connected
 * @returns {undefined}
 */
export default function handleDisconnect(socket) {
  console.log(`socket disconnected from user ${socket.decoded_token.id}`);
  pubsub.publish(USER_STATUS_CHANGE, { userId: socket.decoded_token.id });
}
