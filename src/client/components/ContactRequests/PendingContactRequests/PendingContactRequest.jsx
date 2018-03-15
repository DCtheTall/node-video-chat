import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import IGNORE_CONTACT_REQUEST from '../../../graphql/mutations/contact-requests/ignore.graphql';
import QUERY_PENDING_CONTACT_REQUESTS from '../../../graphql/queries/contact-requests/pending-requests.graphql';
import { addError, clearError } from '../../../actions/error';

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
    this.handleError = this.handleError.bind(this);
  }
  /**
   * @returns {undefined}
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
        <div className="responding-buttons flex-column align-items-center">
          <button>
            <i className="fa fa-plus" />
            &nbsp;
            <span className="webchat-text">
              Accept
            </span>
          </button>
          <button onClick={this.handleIgnore}>
            &times;&nbsp;Ignore
          </button>
        </div>
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
  ignoreContactRequest: PropTypes.func,
};

export default compose(
  connect(null, { addError, clearError }),
  graphql(IGNORE_CONTACT_REQUEST, { name: 'ignoreContactRequest' }),
)(PendingContactRequest);
