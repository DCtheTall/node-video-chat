import {
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql';
import User from './User';

export default new GraphQLObjectType({
  name: 'Contact',
  fields: {
    id: {
      type: GraphQLInt,
      resolve: contact => contact.id,
    },
    user: {
      type: User,
      resolve: contact => contact.user,
    },
  },
});
