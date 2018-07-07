import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import axios from 'axios';
import { getSocketByUserId } from '../../io/helpers';

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
      async resolve(user) {
        const { data } = await axios.get(`${process.env.SIGNAL_SERVER_URL}/user/${user.id}/status`);
        return data.status;
      },
    },
    socketId: {
      type: GraphQLString,
      description: 'the id of the socket the user is currently connected to',
      async resolve(user) {
        const { data } = await axios.get(`${process.env.SIGNAL_SERVER_URL}/user/${user.id}/socket-id`);
        return data.socketId;
      },
    },
  },
});
