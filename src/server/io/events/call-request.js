import { CALL_RECEIVED, CALL_UNAVAILABLE } from '../../../constants';
import { getSocketById, getContactIdBySocketIds } from '../helpers';

/**
 * @param {Object} io socket.io instance
 * @param {Object} socket receiving event
 * @param {Object} payload from message
 * @returns {undefined}
 */
export default async function handleCallRequest(io, socket, { toId }) {
  console.log(`Call request from ${socket.id} to call ${toId}`);
  const toSocket = getSocketById(io, toId);
  if (!toSocket) socket.emit(CALL_UNAVAILABLE, { toId });
  let contactId;
  try {
    contactId = await getContactIdBySocketIds(io, toId, socket.id);
    console.log(contactId);
  } catch (err) {
    console.log(err);
    socket.emit(CALL_UNAVAILABLE, { toId });
  }
  toSocket.emit(CALL_RECEIVED, { fromId: socket.id, contactId });
}
