import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import HelloWorld from '../components/HelloWorld';

/**
 * @class PageLayout
 * @extends {React.PureComponent}
 */
class PageLayout extends React.Component {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="app-container">
        {renderRoutes(this.props.route.routes)}
        <HelloWorld />
      </div>
    );
  }
}

PageLayout.propTypes = {
  route: PropTypes.shape(),
};

export default PageLayout;
