import { User } from '../types';

export default {
  type: User,
  name: 'User',
  resolve: (_, args, req) => req.user || {},
};
