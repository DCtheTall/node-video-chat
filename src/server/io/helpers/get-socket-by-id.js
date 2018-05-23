/**
 *
 * @param {Object} io instance of socket.io
 * @param {string} id socket id
 * @returns {Object} socket.io instance
 */
export default function getSocketById(io, id) {
  const { connected } = io.sockets.clients();
  const connectedSockets = Object.keys(connected).map(key => connected[key]);
  return connectedSockets.find(so => so.id === id);
}
