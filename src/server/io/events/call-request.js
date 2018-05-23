import { CALL_RECEIVED, CALL_UNAVAILABLE } from '../../../constants';
import getSocketById from '../helpers/get-socket-by-id';

/**
 * @param {Object} io socket.io instance
 * @param {Object} socket receiving event
 * @param {Object} payload from message
 * @returns {undefined}
 */
export default function handleCallRequest(io, socket, { toId }) {
  console.log(`Call request from ${socket.id} to call ${toId}`);
  const toSocket = getSocketById(io, toId);
  if (!toSocket) socket.emit(CALL_UNAVAILABLE, { toId });
  toSocket.emit(CALL_RECEIVED, { fromId: socket.id });
}
