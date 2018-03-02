const {
  GraphQLInputObjectType,
  GraphQLString,
} = require('graphql');
const { UserToken } = require('../../types');
const jwt = require('jsonwebtoken');

const LoginUserInput = new GraphQLInputObjectType({
  name: 'LoginUserInput',
  fields: {
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
});

module.exports = {
  type: UserToken,
  name: 'LoginUser',
  args: {
    loginInput: { type: LoginUserInput },
  },
  async resolve(_, { loginInput: { email, password } }) {
    try {
      const user = await models.user.findOne({ where: { email: { $iLike: email.trim() } } });
      if (!user) return { token: null, message: 'No user with that email' };
      if (!(await user.validatePassword(password))) return { token: null, message: 'Invalid email/password' };
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 });
      return { token, message: 'success' };
    } catch (err) {
      console.log(err);
      return { token: null, message: 'Something went wrong' };
    }
  },
};
