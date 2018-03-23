import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
 } from 'graphql';

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
        const { connected } = req.app.io.sockets.clients();
        const connectedSockets = Object.keys(connected).map(key => connected[key]);
        const socket = connectedSockets.find(so => so.decoded_token.id === user.id);
        if (socket) return 'available';
        return 'offline';
      },
    },
  },
});
