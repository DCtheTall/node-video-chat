import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'redux';
import QUERY_USER_ID from '../graphql/queries/user/id.graphql';
import LOGOUT_MUTATION from '../graphql/mutations/user/logout.graphql';
import { LOGIN_ROUTE } from '../constants';
import { isLoggedIn } from '../helpers/auth-helpers';
import { addError } from '../actions/error';

/**
 * @class PageLayout
 * @extends {React.PureComponent}
 */
class PageLayout extends React.Component {
  /**
   * @constructor
   * @constructs PageLayout
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  /**
   * @returns {undefined}
   */
  componentDidMount() {
    if (!isLoggedIn(this.props.data.user)) {
      this.context.router.history.replace(LOGIN_ROUTE);
    }
  }
  /**
   * @param {Object} props before update
   * @returns {undefined}
   */
  componentDidUpdate(props) {
    if (isLoggedIn(props.data.user) && !isLoggedIn(this.props.data.user)) {
      this.context.router.history.replace(LOGIN_ROUTE);
    }
  }
  /**
   * @returns {Promise<undefined>} logs user out
   */
  async logout() {
    try {
      const { data } = await this.props.logoutUser();
      if (!data.result || !data.result.success) return this.props.addError('Something went wrong logging you out');
      return this.props.data.refetch();
    } catch (err) {
      console.log(err);
      return this.props.addError('Something went wrong logging you out');
    }
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="app-container">
        {renderRoutes(this.props.route.routes)}
        {isLoggedIn(this.props.data.user) && (
          <button onClick={this.logout}>
            Log Out
          </button>
        )}
      </div>
    );
  }
}

PageLayout.contextTypes = {
  router: PropTypes.shape(),
};

PageLayout.propTypes = {
  route: PropTypes.shape(),
  data: PropTypes.shape({
    user: PropTypes.shape(),
    refetch: PropTypes.func,
  }),
  addError: PropTypes.func,
  logoutUser: PropTypes.func,
};

export default compose(
  connect(null, { addError }),
  graphql(QUERY_USER_ID),
  graphql(LOGOUT_MUTATION, { name: 'logoutUser' }),
)(PageLayout);
