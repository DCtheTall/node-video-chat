import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import User from './User';
import Contact from './Contact';
import Message from './Message';

export default new GraphQLObjectType({
  name: 'MessageThread',
  fields: {
    id: {
      type: GraphQLInt,
      resolve: thread => thread.id,
    },
    user: {
      type: User,
      resolve: thread => (thread.user1 || thread.user2),
    },
    contact: {
      type: Contact,
      resolve: thread => thread.contact,
    },
    messages: {
      type: new GraphQLList(Message),
      resolve: thread => thread.messages,
    },
  },
});
