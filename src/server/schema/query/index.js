import { GraphQLObjectType } from 'graphql';
import User from './User';
import Users from './Users';
import ContactRequests from './ContactRequests';
import Contacts from './Contacts';
import MessageThreads from './MessageThreads';

export default new GraphQLObjectType({
  name: 'QueryRoot',
  fields: {
    User,
    Users,
    ContactRequests,
    Contacts,
    MessageThreads,
  },
});
