import P2P from 'socket.io-p2p';

/**
 * @param {Object} socket io instance
 * @returns {Object} socket.io-p2p instance
 */
export default function connectP2P(socket) {
  const p2p = new P2P(socket, { autoUpgrade: false });
  return p2p;
}
