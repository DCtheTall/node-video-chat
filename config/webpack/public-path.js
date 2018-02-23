/**
 * @returns {string} publicPath for webpack
 */
function publicPath() {
  // TODO account for hot loading
  return '/dist/';
}

module.exports = publicPath();
