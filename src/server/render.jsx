const React = require('react');
const PropTypes = require('prop-types');
const { renderToString } = require('react-dom/server');
const StaticRouter = require('react-router-dom/StaticRouter').default;
const { renderRoutes } = require('react-router-config');
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
  const html = renderToString(<App location={req.url} />);
  res.render('index', { html });
}

module.exports = render;
