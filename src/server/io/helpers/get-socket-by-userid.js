/**
 * @param {Object} userId of user whose socket to search for
 * @param {Object} io socket.io instance
 * @returns {Object} socket for particular user
 */
export default function getSocketByUserId(userId, io) {
  const { connected } = io.sockets.clients();
  const connectedSockets = Object.keys(connected).map(key => connected[key]);
  return connectedSockets.find(so => so.decoded_token.id === userId);
}
