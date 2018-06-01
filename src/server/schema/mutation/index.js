import { GraphQLObjectType } from 'graphql';

import LoginUser from './user/LoginUser';
import LogoutUser from './user/LogoutUser';
import SignupUser from './user/SignupUser';
import UpdateUser from './user/UpdateUser';
import UpdatePicture from './user/UpdatePicture';

import CreateContactRequest from './contact-requests/CreateContactRequest';
import IgnoreContactRequest from './contact-requests/IgnoreContactRequest';
import AcceptContactRequest from './contact-requests/AcceptContactRequest';

import CreateMessageThread from './message-threads/CreateMessageThread';

import UserTyping from './messages/UserTyping';
import CreateMessage from './messages/CreateMessage';
import ReadMessage from './messages/ReadMessage';

export default new GraphQLObjectType({
  name: 'MutationRoot',
  fields: {
    LoginUser,
    LogoutUser,
    SignupUser,
    UpdateUser,
    UpdatePicture,

    CreateContactRequest,
    IgnoreContactRequest,
    AcceptContactRequest,

    CreateMessageThread,

    UserTyping,
    CreateMessage,
    ReadMessage,
  },
});
