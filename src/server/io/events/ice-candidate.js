import { ICE_CANDIDATE } from '../../../constants';
import { getSocketById } from '../helpers';

/**
 * @param {Object} io socket.io instance
 * @param {Object} socket receiving event
 * @param {Object} payload from message
 * @returns {undefined}
 */
export default function handleIceCandidate(io, socket, { toId, data }) {
  console.log(`Sending ICE candidate from ${socket.id} to ${toId}`);
  const toSocket = getSocketById(io, toId);
  if (!toSocket) {
    // TODO emit hangup
    return;
  }
  toSocket.emit(ICE_CANDIDATE, { data });
}
