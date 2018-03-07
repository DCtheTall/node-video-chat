import { GraphQLObjectType } from 'graphql';
import User from './User';
import Users from './Users';

export default new GraphQLObjectType({
  name: 'QueryRoot',
  fields: {
    User,
    Users,
  },
});
