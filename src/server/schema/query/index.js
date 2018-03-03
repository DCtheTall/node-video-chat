import { GraphQLObjectType } from 'graphql';
import User from './User';

export default new GraphQLObjectType({
  name: 'QueryRoot',
  fields: {
    User,
  },
});
