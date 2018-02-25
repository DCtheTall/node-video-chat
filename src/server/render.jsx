const React = require('react');
const PropTypes = require('prop-types');
// const { renderToString } = require('react-dom/server');
const StaticRouter = require('react-router-dom/StaticRouter').default;
const { renderRoutes } = require('react-router-config');
const { SchemaLink } = require('apollo-link-schema');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { ApolloClient } = require('apollo-client');
const { ApolloProvider, renderToStringWithData } = require('react-apollo');
const schema = require('./schema');
const routes = require('../client/routes').default;

const context = {};

/**
 * @param {ApolloClient} client for GraphQL
 * @returns {function} React.Component app
 */
function createApp(client) {
  const App = ({ location }) => (
    <ApolloProvider client={client}>
      <StaticRouter location={location} context={context}>
        {renderRoutes(routes)}
      </StaticRouter>
    </ApolloProvider>
  );
  App.propTypes = { location: PropTypes.string };
  return App;
}

/**
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
async function render(req, res) {
  const link = new SchemaLink({ schema });
  const cache = new InMemoryCache();
  const client = new ApolloClient({ link, cache, ssrMode: true });
  const App = createApp(client);
  const html = await renderToStringWithData(<App location={req.url} />);
  const initialState = client.extract(); console.log(client.extract());
  res.render('index', { html, state: JSON.stringify(initialState) });
}

module.exports = render;
