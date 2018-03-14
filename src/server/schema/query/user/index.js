import User from '../../types/User';

export default {
  type: User,
  name: 'User',
  resolve: (_, args, req) => req.user || {},
};
