import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import QUERY_USER_ID from '../graphql/queries/user/id.graphql';
import QUERY_PENDING_CONTACT_REQUESTS from '../graphql/queries/contact-requests/pending-requests.graphql';
import QUERY_CONTACTS from '../graphql/queries/contacts/contacts.graphql';
import SUBSCRIBE_TO_CONTACT_REQUEST_RECEIVED from '../graphql/subscriptions/contact-requests/contact-request-received.graphql';
import SUBSCRIBE_TO_CONTACT_REQUEST_ACCEPTED from '../graphql/subscriptions/contact-requests/contact-request-accepted.graphql';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../constants';
import { isLoggedIn } from '../helpers/auth-helpers';
import { addError } from '../actions/error';
import Topbar from '../components/Layout/Topbar';
import ErrorBar from '../components/Layout/ErrorBar';
import NoticeBar from '../components/Layout/NoticeBar';
import { addNotice } from '../actions/notice';
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
    this.subscribeToNewContactRequests();
    this.subscribeToAcceptedContactRequests();
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
   * @returns {undefined}
   */
  subscribeToNewContactRequests() {
    this.props.pendingRequests.subscribeToMore({
      document: SUBSCRIBE_TO_CONTACT_REQUEST_RECEIVED,
      variables: {
        userId: this.props.data.user && this.props.data.user.id,
      },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        if (!data || !data.requestReceived) return prev;
        this.props.addNotice(`${data.requestReceived.sender.username} sent you a contact request!`);
        return {
          ...prev,
          data: [
            data.requestReceived,
            ...prev.data,
          ],
        };
      },
    });
  }
  /**
   * @returns {undefined}
   */
  subscribeToAcceptedContactRequests() {
    this.props.contacts.subscribeToMore({
      document: SUBSCRIBE_TO_CONTACT_REQUEST_ACCEPTED,
      variables: {
        userId: this.props.data.user && this.props.data.user.id,
      },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        if (!data || !data.newContact) return prev;
        this.props.addNotice(`${data.newContact.user.username} accepted your contact request!`);
        return {
          ...prev,
          data: [
            data.newContact,
            ...prev.data,
          ],
        };
      },
    });
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
        {Boolean(this.props.error || this.props.notice) && (
          <div className="banner-container">
            <NoticeBar />
            <ErrorBar />
          </div>
        )}
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
  error: PropTypes.string,
  notice: PropTypes.string,
  pendingRequests: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
    subscribeToMore: PropTypes.func,
  }),
  contacts: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
    subscribeToMore: PropTypes.func,
  }),
  addNotice: PropTypes.func,
};

export default compose(
  withRouter,
  connect(
    state => ({ error: state.error, notice: state.notice }),
    { addError, addNotice },
  ),
  graphql(QUERY_USER_ID),
  graphql(
    QUERY_PENDING_CONTACT_REQUESTS,
    { name: 'pendingRequests' },
  ),
  graphql(
    QUERY_CONTACTS,
    { name: 'contacts' },
  ),
)(PageLayout);
