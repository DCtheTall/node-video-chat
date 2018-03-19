import { GraphQLSchema } from 'graphql';
import query from './query';
import mutation from './mutation';
import subscription from './subscription';

const schema = new GraphQLSchema({ query, mutation, subscription });

export default schema;
