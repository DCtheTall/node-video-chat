const { GraphQLSchema } = require('graphql');
const query = require('./query');
const mutation = require('./mutation');

const schema = new GraphQLSchema({ query, mutation });

module.exports = schema;
