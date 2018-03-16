import { MutationResponse } from '../../types';

export default {
  type: MutationResponse,
  name: 'LogoutUser',
  resolve(parent, args, req) {
    try {
      req.cookies.set(process.env.COOKIE_KEY);
    } catch (err) {
      console.log(err);
      return { success: false };
    }
    return { success: true };
  },
};
