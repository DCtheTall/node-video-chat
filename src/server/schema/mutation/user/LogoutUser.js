import {
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql';

const LogoutUserOutputType = new GraphQLObjectType({
  name: 'LogoutUserResult',
  fields: {
    success: {
      type: GraphQLBoolean,
      resolve: obj => obj.success,
    },
  },
});

export default {
  type: LogoutUserOutputType,
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
