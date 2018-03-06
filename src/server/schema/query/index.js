import { GraphQLObjectType } from 'graphql';
import User from './User';
import UserSearch from './UserSearch';

export default new GraphQLObjectType({
  name: 'QueryRoot',
  fields: {
    User,
    UserSearch,
  },
});
