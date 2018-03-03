import { GraphQLObjectType } from 'graphql';
import LoginUser from './user/LoginUser';
import LogoutUser from './user/LogoutUser';
import SignupUser from './user/SignupUser';

export default new GraphQLObjectType({
  name: 'MutationRoot',
  fields: {
    LoginUser,
    LogoutUser,
    SignupUser,
  },
});
