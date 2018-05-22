import { GraphQLObjectType } from 'graphql';
import User from './User';
import Users from './Users';
import ContactRequests from './ContactRequests';
import Contacts from './Contacts';
import Contact from './Contact';
import MessageThreads from './MessageThreads';
import MessageThread from './MessageThread';

export default new GraphQLObjectType({
  name: 'QueryRoot',
  fields: {
    User,
    Users,
    ContactRequests,
    Contact,
    Contacts,
    MessageThread,
    MessageThreads,
  },
});
