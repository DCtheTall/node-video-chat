const React = require('react');
const PropTypes = require('prop-types');
const { renderToString } = require('react-dom/server');
const StaticRouter = require('react-router-dom/StaticRouter').default;
const { renderRoutes } = require('react-router-config');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { ApolloClient } = require('apollo-client');
const { ApolloProvider } = require('react-apollo');
const fetch = require('node-fetch');
const routes = require('../client/routes').default;

const context = {};

/**
 * @param {Object} props for app
 * @returns {JSX.Element} React app
 */
function App(props) {
  return (
    <StaticRouter location={props.location} context={context}>
      {renderRoutes(routes)}
    </StaticRouter>
  );
}

App.propTypes = {
  location: PropTypes.string,
};

/**
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
function render(req, res) {
  const link = createHttpLink({
    fetch,
    uri: process.env.GRAPHQL_URI,
    headers: {
      cookie: req.header('Cookie'),
    },
  });
  const cache = new InMemoryCache();
  const client = new ApolloClient({ link, cache, ssrMode: true });
  const html = renderToString((
    <ApolloProvider client={client}>
      <App location={req.url} />
    </ApolloProvider>
  ));
  res.render('index', { html });
}

module.exports = render;
