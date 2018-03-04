import User from '../../types/User';

export default {
  type: User,
  resolve: (_, args, req) => req.user,
};
