import { GraphQLObjectType } from 'graphql';

import ContactRequestReceived from './contact-requests/ContactRequestReceived';
import ContactRequestAccepted from './contact-requests/ContactRequestAccepted';

import UserStatusChange from './users/UserStatusChange';

import UserTyping from './messages/UserTyping';

export default new GraphQLObjectType({
  name: 'SubscriptionRoot',
  fields: {
    ContactRequestReceived,
    ContactRequestAccepted,
    UserStatusChange,
    UserTyping,
  },
});
