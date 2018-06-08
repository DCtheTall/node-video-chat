import React from 'react';
import PropTypes from 'prop-types';
import StaticRouter from 'react-router-dom/StaticRouter';
import { renderRoutes } from 'react-router-config';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import { Provider } from 'react-redux';
import schema from '../schema';
import routes from '../../client/routes';
import store from '../../client/store';

const context = {};

/**
 * @param {Express.Request} req the request
 * @param {ApolloClient} apolloClient for GraphQL
 * @returns {function} React.Component app
 */
function createApp(req, apolloClient) {
  const App = ({ location }) => (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <StaticRouter location={location} context={context}>
          {renderRoutes(routes, { userAgent: req.headers['user-agent'] })}
        </StaticRouter>
      </ApolloProvider>
    </Provider>
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
  const link = new SchemaLink({ schema, context: req });
  const cache = new InMemoryCache();
  const apolloClient = new ApolloClient({ link, cache, ssrMode: true });
  const initialState = apolloClient.extract();
  const manifest = await import('../../../public/dist/manifest.json');

  const App = createApp(req, apolloClient);
  const html = await renderToStringWithData(<App location={req.url} />);

  const token = req.cookies.get(process.env.COOKIE_KEY, { signed: true }) || '';

  res.render('index', {
    html,
    token: JSON.stringify(token),
    state: JSON.stringify(initialState).replace(/</g, '\\u003c'),
    manifest,
  });
}

export default render;
