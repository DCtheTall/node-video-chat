import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from './routes';
// import PropTypes from 'prop-types';

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
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
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
