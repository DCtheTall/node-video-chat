import { GraphQLList, GraphQLString } from 'graphql';
import search from './search';
import User from '../../types/User';

export default {
  type: new GraphQLList(User),
  name: 'UserSearch',
  args: {
    query: { type: GraphQLString },
    searchType: { type: GraphQLString },
  },
  resolve(parent, { query, searchType }, req) {
    if (!query) return [];
    return search(req, query, searchType);
  },
};
