import io from 'socket.io';
import adapter from 'socket.io-redis';
import { authorize } from 'socketio-jwt';
import { USER_STATUS_CHANGE } from './schema/subscription/pubsub/constants';
import pubsub from './schema/subscription/pubsub';

/**
 * @param {Object} server HTTP server instance
 * @returns {Object} socket.io instance
 */
export default function initIO(server) {
  const instance = io(server);
  instance.adapter(adapter({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }));
  instance.use(authorize({
    handshake: true,
    secret: process.env.JWT_SECRET,
  }));

  instance.on('connection', (socket) => {
    console.log(`socket connected to user ${socket.decoded_token.id}`);
    pubsub.publish(USER_STATUS_CHANGE, { userId: socket.decoded_token.id });

    socket.on('disconnect', () => {
      console.log(`socket disconnected from user ${socket.decoded_token.id}`);
      pubsub.publish(USER_STATUS_CHANGE, { userId: socket.decoded_token.id });
    });

    socket.on('peer-msg', (data) => {
      const { toUser, peerId } = data;
      const { connected } = instance.sockets.clients();
      const connectedSockets = Object.keys(connected).map(key => connected[key]);
      const targetSocket = connectedSockets.find(so => so.id === toUser);
      console.log(peerId);
      targetSocket.emit('sendPeerId', { peerId });
    });
  });

  return instance;
}
