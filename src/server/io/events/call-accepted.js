import Twilio from 'twilio';
import {
  CALL_ACCEPTED,
  CALL_CANCELED,
  ICE_SERVER_CONFIG,
} from '../../../constants';
import { getSocketById } from '../helpers';

const twilio = Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * @param {Object} io socket.io instance
 * @param {Object} socket which received the event
 * @param {Object} payload from the call accepted event
 * @returns {undefined}
 */
export default async function callAccepted(io, socket, { toId }) {
  console.log(`Call from ${toId} to ${socket.id} accepted. Establishing peer connection`);
  try {
    const toSocket = getSocketById(io, toId);
    if (!toSocket) {
      socket.emit(CALL_CANCELED);
      return;
    }
    const token = await twilio.tokens.create();
    toSocket.emit(CALL_ACCEPTED, { iceServerConfig: token.iceServers });
    socket.emit(ICE_SERVER_CONFIG, { iceServerConfig: token.iceServers });
  } catch (err) {
    console.log(err);
    socket.emit(CALL_CANCELED);
  }
}
