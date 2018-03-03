import { GraphQLObjectType } from 'graphql';
import User from './User';

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    User,
  },
});
