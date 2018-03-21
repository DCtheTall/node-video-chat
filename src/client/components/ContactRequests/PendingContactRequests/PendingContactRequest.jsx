import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import IGNORE_CONTACT_REQUEST from '../../../graphql/mutations/contact-requests/ignore.graphql';
import ACCEPT_CONTACT_REQUEST from '../../../graphql/mutations/contact-requests/accept.graphql';
import QUERY_PENDING_CONTACT_REQUESTS from '../../../graphql/queries/contact-requests/pending-requests.graphql';
import QUERY_CONTACTS from '../../../graphql/queries/contacts/contacts.graphql';
import { addError, clearError } from '../../../actions/error';
import { addNotice, clearNotice } from '../../../actions/notice';
import Loader from '../../Layout/Loader';
import '../../../styles/pending-contact-request.scss';

/**
 * @class PendingContactRequest
 * @extends {React.PureComponent}
 */
class PendingContactRequest extends React.PureComponent {
  /**
   * @constructor
   * @constructs PendingContactRequest
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { submitting: false };
    this.handleIgnore = this.handleIgnore.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleError = this.handleError.bind(this);
  }
  /**
   * @returns {Promise<undefined>} ignores contact request w GraphQL API
   */
  async handleIgnore() {
    this.props.clearError();
    await new Promise(resolve => this.setState({ submitting: true }, resolve));
    try {
      const { data } = await this.props.ignoreContactRequest({
        variables: { requestId: this.props.id },
        refetchQueries: [{ query: QUERY_PENDING_CONTACT_REQUESTS }],
      });
      if (!data.result) return this.handleError();
      const { success, message } = data.result;
      if (!success) return this.handleError(message);
      return new Promise(resolve => this.setState({ submitting: false }, resolve));
    } catch (err) {
      console.log(err);
      return this.handleError();
    }
  }
  /**
   * @returns {Promise<undefined>} accepts contact request w GraphQL API
   */
  async handleAccept() {
    this.props.clearError();
    this.props.clearNotice();
    await new Promise(resolve => this.setState({ submitting: true }, resolve));
    try {
      const { data } = await this.props.acceptContactRequest({
        variables: { requestId: this.props.id },
        refetchQueries: [
          { query: QUERY_PENDING_CONTACT_REQUESTS },
          { query: QUERY_CONTACTS },
        ],
      });
      if (!data.result) return this.handleError();
      const { success, message, username } = data.result;
      if (!success) return this.handleError(message);
      await new Promise(resolve => this.setState({ submitting: false }, resolve));
      return this.props.addNotice(`Added ${username} to your contacts`);
    } catch (err) {
      console.log(err);
      return this.handleError();
    }
  }
  /**
   * @param {string} error message to display
   * @returns {Promise<undefined>} sets state and displays error
   */
  async handleError(error = 'Something went wrong responding to the contact request') {
    await new Promise(resolve => this.setState({ submitting: false }, resolve));
    return this.props.addError(error);
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="pending-contact-request display-flex">
        <div className="user-info display-flex align-items-center">
          <img
            src={this.props.sender.pictureUrl}
            alt={this.props.sender.username}
          />
          <div className="flex-column">
            <span className="username">
              {this.props.sender.username}
            </span>
            <span className="email">
              {this.props.sender.email}
            </span>
          </div>
        </div>
        {this.state.submitting ? (
          <Loader />
        ) : (
          <div className="responding-buttons flex-column justify-content-center">
            <button className="accept" onClick={this.handleAccept}>
              <i className="fa fa-plus" />
              &nbsp;
              <span>
                Accept
              </span>
            </button>
            <button onClick={this.handleIgnore}>
              &times;&nbsp;Ignore
            </button>
          </div>
        )}
      </div>
    );
  }
}

PendingContactRequest.propTypes = {
  id: PropTypes.number,
  sender: PropTypes.shape({
    pictureUrl: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
  }),
  addError: PropTypes.func,
  clearError: PropTypes.func,
  addNotice: PropTypes.func,
  clearNotice: PropTypes.func,
  ignoreContactRequest: PropTypes.func,
  acceptContactRequest: PropTypes.func,
};

export default compose(
  connect(null, { addError, clearError, addNotice, clearNotice }),
  graphql(IGNORE_CONTACT_REQUEST, { name: 'ignoreContactRequest' }),
  graphql(ACCEPT_CONTACT_REQUEST, { name: 'acceptContactRequest' }),
)(PendingContactRequest);
