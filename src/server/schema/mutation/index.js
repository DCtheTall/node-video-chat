import { GraphQLObjectType } from 'graphql';
import LoginUser from './user/LoginUser';

export default new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    LoginUser,
  },
});
