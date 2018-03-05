import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import QUERY_USER_ID from '../graphql/queries/user/id.graphql';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../constants';
import { isLoggedIn } from '../helpers/auth-helpers';
import { addError } from '../actions/error';
import Topbar from '../components/Layout/Topbar';
import ErrorBar from '../components/Layout/ErrorBar';
import '../styles/layout.scss';

/**
 * @class PageLayout
 * @extends {React.PureComponent}
 */
class PageLayout extends React.PureComponent {
  /**
   * @constructor
   * @constructs PageLayout
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { isMobileDevice: false };
    this.isAuthRoute = this.isAuthRoute.bind(this);
    this.isMobileDevice = this.isMobileDevice.bind(this);
  }
  /**
   * @returns {undefined}
   */
  componentDidMount() {
    if (!isLoggedIn(this.props.data.user) && !this.isAuthRoute()) {
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
   * @returns {boolean} true if on the login/signup page
   */
  isAuthRoute() {
    return (
      this.props.location.pathname === SIGNUP_ROUTE
      || this.props.location.pathname === LOGIN_ROUTE
    );
  }
  /**
   * @returns {boolean} true if user is on mobile device
   */
  isMobileDevice() {
    const mobileDeviceRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileDeviceRegex.test(this.props.userAgent);
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    if (this.isMobileDevice()) {
      return (
        <div className="app-container flex-column">
          <Topbar />
          <div className="flex-center">
            <span className="text-center mobile-text">
              Sorry, WebChat uses WebRTC for communications,
              which is not supported by most mobile browsers yet.
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className="app-container">
        <Topbar />
        <ErrorBar />
        {renderRoutes(this.props.route.routes)}
      </div>
    );
  }
}

PageLayout.contextTypes = {
  router: PropTypes.shape(),
};

PageLayout.propTypes = {
  userAgent: PropTypes.string,
  location: PropTypes.shape(),
  route: PropTypes.shape(),
  data: PropTypes.shape({
    user: PropTypes.shape(),
    refetch: PropTypes.func,
  }),
};

export default compose(
  withRouter,
  connect(null, { addError }),
  graphql(QUERY_USER_ID),
)(PageLayout);
