import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
} from 'graphql';

export default new GraphQLObjectType({
  name: 'MutationResponse',
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  },
});
