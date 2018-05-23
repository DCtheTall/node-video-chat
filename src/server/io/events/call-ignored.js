import { CALL_UNAVAILABLE } from '../../../constants';
import getSocketById from '../helpers/get-socket-by-id';

/**
 * @param {Object} io socket.io instance
 * @param {Object} socket receiving event
 * @param {Object} payload from message
 * @returns {undefined}
 */
export default function handleCallIgnored(io, socket, { fromId }) {
  console.log(`Call from ${fromId} ignored by ${socket.id}`);
  const fromSocket = getSocketById(io, fromId);
  return fromSocket && fromSocket.emit(CALL_UNAVAILABLE, { toId: socket.id });
}
