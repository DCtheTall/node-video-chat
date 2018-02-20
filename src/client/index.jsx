import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

/**
 * @returns {undefined}
 */
function render() {
  ReactDOM.hydrate(
    <App />,
    document.getElementById('entry-point')
  );
}

render();
