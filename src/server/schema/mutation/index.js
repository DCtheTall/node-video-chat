import { GraphQLObjectType } from 'graphql';
import LoginUser from './user/LoginUser';
import LogoutUser from './user/LogoutUser';

export default new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    LoginUser,
    LogoutUser,
  },
});
