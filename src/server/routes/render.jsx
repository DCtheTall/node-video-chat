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
import configureStore from '../../client/store';

const context = {};

/**
 * @param {Express.Request} req the request
 * @param {ApolloClient} client for GraphQL
 * @returns {function} React.Component app
 */
function createApp(req, client) {
  const store = configureStore();
  const App = ({ location }) => (
    <Provider store={store}>
      <ApolloProvider client={client}>
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
  const client = new ApolloClient({ link, cache, ssrMode: true });
  const App = createApp(req, client);
  const html = await renderToStringWithData(<App location={req.url} />);
  const initialState = client.extract();
  res.render('index', { html, state: JSON.stringify(initialState).replace(/</g, '\\u003c') });
}

export default render;
