import { GraphQLObjectType } from 'graphql';

import ContactRequestReceived from './contact-requests/ContactRequestReceived';
import ContactRequestAccepted from './contact-requests/ContactRequestAccepted';

import UserStatusChange from './users/UserStatusChange';
import UserUpdate from './users/UserUpdate';

import UserTyping from './messages/UserTyping';
import MessageCreated from './messages/MessageCreated';
import MessageRead from './messages/MessageRead';

export default new GraphQLObjectType({
  name: 'SubscriptionRoot',
  fields: {
    ContactRequestReceived,
    ContactRequestAccepted,

    UserStatusChange,
    UserUpdate,

    UserTyping,
    MessageCreated,
    MessageRead,
  },
});
