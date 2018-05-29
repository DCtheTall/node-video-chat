import { ICE_DESCRIPTION } from '../../../constants';
import { getSocketById } from '../helpers';

/**
 * @param {Object} io socket.io instance
 * @param {Object} socket receiving event
 * @param {Object} payload from message
 * @returns {undefined}
 */
export default function handleIceDescription(io, socket, { toId, description }) {
  console.log(`Sending session description from ${socket.id} to ${toId}`);
  const toSocket = getSocketById(io, toId);
  if (!toSocket) {
    // TODO emit hangup
    return;
  }
  toSocket.emit(ICE_DESCRIPTION, { description });
}
