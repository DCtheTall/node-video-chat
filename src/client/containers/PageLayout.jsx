import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { graphql } from 'react-apollo';
import CURRENT_USER_ID_QUERY from '../queries/current-user/current-user-id.graphql';

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
      </div>
    );
  }
}

PageLayout.propTypes = {
  route: PropTypes.shape(),
};

export default graphql(CURRENT_USER_ID_QUERY)(PageLayout);
