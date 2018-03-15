import { GraphQLObjectType } from 'graphql';

import LoginUser from './user/LoginUser';
import LogoutUser from './user/LogoutUser';
import SignupUser from './user/SignupUser';

import CreateContactRequest from './contact-requests/CreateContactRequest';
import IgnoreContactRequest from './contact-requests/IgnoreContactRequest';

export default new GraphQLObjectType({
  name: 'MutationRoot',
  fields: {
    LoginUser,
    LogoutUser,
    SignupUser,
    CreateContactRequest,
    IgnoreContactRequest,
  },
});
