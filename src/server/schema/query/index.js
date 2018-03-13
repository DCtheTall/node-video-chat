import { GraphQLObjectType } from 'graphql';
import User from './User';
import Users from './Users';
import ContactRequests from './ContactRequests';

export default new GraphQLObjectType({
  name: 'QueryRoot',
  fields: {
    User,
    Users,
    ContactRequests,
  },
});
