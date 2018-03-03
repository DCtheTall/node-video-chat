import User from '../../types/user';

export default {
  type: User,
  resolve: (_, args, req) => req.user,
};
