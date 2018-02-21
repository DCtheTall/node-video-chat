import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';

/**
 * @class PageLayout
 * @extends {React.PureComponent}
 */
class PageLayout extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="app-container">
        {renderRoutes(this.props.route.routes)}
      </div>
    );
  }
}

PageLayout.propTypes = {
  route: PropTypes.shape(),
};

export default PageLayout;
