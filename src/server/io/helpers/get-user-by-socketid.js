import getSocketById from './get-socket-by-id';

/**
 * @param {string} socketId to search for user with
 * @returns {Object} user instance
 */
export default async function getUserBySocketId(socketId) {
  const socket = getSocketById(socketId);
  if (!socket || !socket.decoded_token) return null;
  return models.user.findById(socket.decoded_token.id);
};
