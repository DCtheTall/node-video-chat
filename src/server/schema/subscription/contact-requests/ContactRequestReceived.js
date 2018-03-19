import { GraphQLObjectType, GraphQLString } from 'graphql';
import { CONTACT_REQUEST_CREATED } from '../pubsub/constants';
import pubsub from '../pubsub';

const ContactReceivedPayload = new GraphQLObjectType({
  name: 'ContactReceivedPayload',
  fields: {
    username: { type: GraphQLString },
  },
});

export default {
  type: ContactReceivedPayload,
  name: 'ContactRequestReceived',
  async resolve(payload, args, req) {
    console.log(`\n\n\n\n\n\n${JSON.stringify(payload)}\n\n\n\n\n`)
    return { username: '' };
  },
  subscribe: () => pubsub.asyncIterator(CONTACT_REQUEST_CREATED),
};
