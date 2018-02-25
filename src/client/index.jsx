import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import routes from './routes';

const link = new HttpLink({ uri: process.env.GRAPHQL_URI });
const cache = new InMemoryCache().restore(window.__APOLLO_STATE__).restore(window.__APOLLO_STATE__);
const client = new ApolloClient({ link, cache });

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
      <ApolloProvider client={client}>
        <BrowserRouter>
          {renderRoutes(routes)}
        </BrowserRouter>
      </ApolloProvider>
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
