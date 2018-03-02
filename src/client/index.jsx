import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Provider } from 'react-redux';
import { AUTH_TOKEN } from './constants';
import routes from './routes';
import configureStore from './store';

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader,
    },
  });
  return forward(operation);
});
const httpLink = new HttpLink({ uri: process.env.GRAPHQL_URI, credentials: 'include' });
const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);
const cache = new InMemoryCache().restore(window.__APOLLO_STATE__).restore(window.__APOLLO_STATE__);
const client = new ApolloClient({ link: httpLinkWithAuthToken, cache });
const store = configureStore();

delete window.__APOLLO_STATE__;

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
            {renderRoutes(routes)}
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
