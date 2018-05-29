import { CALL_HANG_UP } from '../../../constants';
import { getSocketById } from '../helpers';

/**
 * @param {Object} io socket.io instance
 * @param {Object} socket receiving event
 * @param {Object} payload from message
 * @returns {undefined}
 */
export default function handleCallHangup(io, socket, { toId }) {
  const toSocket = getSocketById(io, toId);
  if (!toSocket) return;
  toSocket.emit(CALL_HANG_UP);
}
