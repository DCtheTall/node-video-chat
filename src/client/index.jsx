import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

/**
 * @returns {undefined}
 */
function render() {
  ReactDOM.render(
    <App />,
    document.getElementById('entry-point')
  );
}

window.onload = render;
