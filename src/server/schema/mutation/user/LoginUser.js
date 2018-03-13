import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
} from 'graphql';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

const LoginUserOutputType = new GraphQLObjectType({
  name: 'LoginUserResult',
  fields: {
    success: {
      type: GraphQLBoolean,
      resolve: obj => obj.success,
    },
    message: {
      type: GraphQLString,
      resolve: obj => obj.message,
    },
  },
});

export default {
  type: LoginUserOutputType,
  name: 'LoginUser',
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, { email, password }, req) {
    try {
      const user = await models.user.findOne({
        where: {
          [Op.or]: [
            { email: { $iLike: email.trim() } },
            { username: { $iLike: email.trim() } },
          ],
        },
      });
      if (!user) return { success: false, message: 'No user with that email' };
      if (!(await user.validatePassword(password))) return { success: false, message: 'Invalid email/password' };
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 });
      req.cookies.set(process.env.COOKIE_KEY, token, { signed: true, maxAge: Date.now() + (24 * 60 * 60 * 1e3) });
      return { success: true, message: 'success' };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'Something went wrong logging you in' };
    }
  },
};
