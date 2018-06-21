import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
} from 'graphql';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import validateEmail from '../../../lib/validate-email';

const SignupResponse = new GraphQLObjectType({
  name: 'SignupResponse',
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});

export default {
  type: SignupResponse,
  name: 'SignupUser',
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, { email, username, password }, req) {
    try {
      let [user, created] = await models.user.findOrInitialize({ // eslint-disable-line prefer-const
        where: {
          [Op.or]: [
            { username: { [Op.iLike]: username.trim() } },
            { email: email.trim().toLowerCase() },
          ],
        },
      });
      const { success: validEmail } = await validateEmail(email);
      if (!validEmail) {
        return {
          success: false,
          message: 'Please enter a valid email address',
        };
      }
      if (!created) return { success: false, message: 'There is already an account with that email/username' };
      user.email = email.trim().toLowerCase();
      user.username = username.trim();
      user.password = password;
      user = await user.save();
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 });
      req.cookies.set(process.env.COOKIE_KEY, token, { signed: true, maxAge: Date.now() + (24 * 60 * 60 * 1e3) });
      return {
        success: true,
        message: 'success',
        token,
      };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'Something went wrong signing you up' };
    }
  },
};
