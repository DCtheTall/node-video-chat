import { CALL_CANCELED } from '../../../constants';
import getSocketById from '../helpers/get-socket-by-id';

/**
 * @param {Object} io socket.io instance
 * @param {Object} socket receiving event
 * @param {Object} payload from message
 * @returns {undefined}
 */
export default function handleCallCanceled(io, socket, { toId }) {
  console.log(`Call from ${socket.id} to ${toId} canceled by caller`);
  const toSocket = getSocketById(io, toId);
  return toSocket && toSocket.emit(CALL_CANCELED);
}
