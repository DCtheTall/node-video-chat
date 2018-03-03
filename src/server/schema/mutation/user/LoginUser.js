import {
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';
import jwt from 'jsonwebtoken';

const LoginUserOutputType = new GraphQLObjectType({
  name: 'LoginUserResult',
  fields: {
    token: {
      type: GraphQLString,
      resolve: obj => obj.token,
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
      const user = await models.user.findOne({ where: { email: { $iLike: email.trim() } } });
      if (!user) return { token: null, message: 'No user with that email' };
      if (!(await user.validatePassword(password))) return { token: null, message: 'Invalid email/password' };
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 });
      req.cookies.set(process.env.COOKIE_KEY, token, { signed: true, maxAge: Date.now() + (24 * 60 * 60 * 1e3) });
      return { token, message: 'success' };
    } catch (err) {
      console.log(err);
      return { token: null, message: 'Something went wrong' };
    }
  },
};
