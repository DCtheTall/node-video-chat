import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import QUERY_TOPBAR_DATA from '../../graphql/queries/user/topbar.graphql';
import LOGOUT_MUTATION from '../../graphql/mutations/user/logout.graphql';
import { isLoggedIn } from '../../helpers/auth-helpers';
import { addError, clearError } from '../../actions/error';
import '../../styles/topbar.scss';

/**
 * @class AuthTopbar
 * @extends {React.PureComponent}
 */
class Topbar extends React.PureComponent {
  /**
   * @constructor
   * @constructs Topbar
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  /**
   * @returns {Promise<undefined>} logs user out
   */
  async logout() {
    this.props.clearError();
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
    if (!isLoggedIn(this.props.data.user)) {
      return (
        <div className="topbar display-flex align-items-center">
          <span className="webchat-text not-logged-in">
            WebChat
          </span>
        </div>
      );
    }
    return (
      <div className="topbar display-flex align-items-center">
        <div className="hide-on-mobile display-flex align-items-center">
          <div className="user-picture-container">
            <img
              alt={this.props.data.user.username}
              src={this.props.data.user.pictureUrl}
            />
          </div>
          <span className="webchat-text">
            {this.props.data.user.username}
          </span>
        </div>
        <button onClick={this.logout} className="hide-on-mobile">
          <span className="webchat-text">
            Log Out
          </span>
        </button>
      </div>
    );
  }
}

Topbar.propTypes = {
  data: PropTypes.shape({
    refetch: PropTypes.func,
    user: PropTypes.shape({
      username: PropTypes.string,
      pictureUrl: PropTypes.string,
    }),
  }),
  logoutUser: PropTypes.func,
  addError: PropTypes.func,
  clearError: PropTypes.func,
};

export default compose(
  connect(null, { addError, clearError }),
  graphql(QUERY_TOPBAR_DATA),
  graphql(LOGOUT_MUTATION, { name: 'logoutUser' }),
)(Topbar);
