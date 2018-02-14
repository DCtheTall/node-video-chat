const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require('../client/app').default;

/**
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
function render(req, res) {
  const html = renderToString(<App />);
  res.render('index', { html });
}

module.exports = render;
