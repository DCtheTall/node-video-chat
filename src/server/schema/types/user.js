import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

function getUserSocket(user, io) {
  const { connected } = io.sockets.clients();
  const connectedSockets = Object.keys(connected).map(key => connected[key]);
  return connectedSockets.find(so => so.decoded_token.id === user.id);
}

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLInt,
      description: 'the user\'s unique ID',
      resolve: user => user.id,
    },
    email: {
      type: GraphQLString,
      description: 'the user\'s email',
      resolve: user => user.email,
    },
    username: {
      type: GraphQLString,
      description: 'the username',
      resolve: user => user.username,
    },
    pictureUrl: {
      type: GraphQLString,
      description: 'the username',
      resolve: user => user.pictureUrl,
    },
    status: {
      type: GraphQLString,
      description: 'the contacts current status: available or offline',
      resolve(user, args, req) {
        const socket = getUserSocket(user, req.app.io);
        if (socket) return 'available';
        return 'offline';
      },
    },
    socketId: {
      type: GraphQLString,
      description: 'the id of the socket the user is currently connected to',
      resolve(user, args, req) {
        const socket = getUserSocket(user, req.app.io);
        if (socket) return socket.id;
        return null;
      },
    },
  },
});
