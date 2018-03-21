import { GraphQLObjectType } from 'graphql';

import ContactRequestReceived from './contact-requests/ContactRequestReceived';
import ContactRequestAccepted from './contact-requests/ContactRequestAccepted';

export default new GraphQLObjectType({
  name: 'SubscriptionRoot',
  fields: {
    ContactRequestReceived,
    ContactRequestAccepted,
  },
});
