import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-client-preset';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.scss';

import routes from './routes';
import store from './store';
import { setToken } from './actions/token';
import getSocket from './socket';

store.dispatch(setToken(window.__JWT_TOKEN__));
const socket = getSocket();

const httpLink = new HttpLink({ uri: process.env.GRAPHQL_URI, credentials: 'include' });
const wsLink = new WebSocketLink({
  uri: process.env.GRAPHQL_WS_URI,
  options: {
    reconnect: true,
  },
});
const subscriptionMiddleware = {
  applyMiddleware(options, next) {
    const { token } = store.getState();
    options.connectionParams = { authToken: token };
    next();
  },
};
wsLink.subscriptionClient.use([subscriptionMiddleware]);
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache().restore(window.__APOLLO_STATE__);
const client = new ApolloClient({ link, cache, connectToDevTools: true });

delete window.__APOLLO_STATE__;
delete window.__JWT_TOKEN__;

/**
 * @class Router
 * @extends {React.PureComponent}
 */
class Routes extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <BrowserRouter>
            {renderRoutes(routes, { userAgent: navigator.userAgent })}
          </BrowserRouter>
        </ApolloProvider>
      </Provider>
    );
  }
}

/**
 * @returns {undefined}
 */
function render() {
  ReactDOM.hydrate(
    <Routes />,
    document.getElementById('entry-point')
  );
}

render();
