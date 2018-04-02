import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import Textarea from 'react-textarea-autosize';
import Promise from 'bluebird';
import { graphql, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import USER_TYPING_MUTATION from '../../../graphql/mutations/messages/user-typing.graphql';
import USER_TYPING_SUBSCRIPTION from '../../../graphql/subscriptions/messages/user-typing.graphql';
import CREATE_MESSAGE_MUTATION from '../../../graphql/mutations/messages/create-message.graphql';
import { addError, clearError } from '../../../actions/error';
import '../../../styles/message-input.scss';

/**
 * @class MessageInput
 * @extends {React.PureComponent}
 */
class MessageInput extends React.PureComponent {
  /**
   * @constructor
   * @constructs MessageInput
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      userTyping: false,
      submitting: false,
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendUserTyping = debounce(
      this.sendUserTyping.bind(this),
      300,
      { leading: true, tailing: false, maxWait: 300 },
    );
  }
  /**
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.client.subscribe({
      query: USER_TYPING_SUBSCRIPTION,
      variables: { currentlyMessagingUser: this.props.user.id },
    })
    .subscribe(async () => {
      if (this.clearTypingMessageTimeout) clearTimeout(this.clearTypingMessageTimeout);
      await new Promise(resolve => this.setState({ userTyping: true }, resolve));
      this.clearTypingMessageTimeout = setTimeout(() => this.setState({ userTyping: false }), 1500);
    });
  }
  /**
   * @param {Object} event onchange event
   * @returns {undefined}
   */
  handleMessageChange({ target: { value } }) {
    if (value) this.sendUserTyping();
    this.setState({ message: value });
  }
  /**
   * @param {Object} event keydown event
   * @returns {Promise<undefined>} submits message
   */
  handleEnterPress({ keyCode }) {
    return keyCode === 13 && this.state.message && this.handleSubmit();
  }
  /**
   * @param {string} error message to display
   * @returns {Promise<undefined>} displays error to user
   */
  async handleError(error = 'Something went wrong sending your message') {
    await new Promise(resolve => this.setState({ submitting: false }, resolve));
    return this.props.addError(error);
  }
  /**
   * @returns {Promise<undefined>} submits message
   */
  async handleSubmit() {
    this.props.clearError();
    await new Promise(resolve => this.setState({ submitting: true }, resolve));
    try {
      const { data } = await this.props.createMessage({
        variables: {
          threadId: this.props.match.params.threadid,
          body: this.state.message,
        },
        // refetchQueries TODO when query message
      });
      if (!data.result) return this.handleError();
      const { success, message } = data.result;
      if (!success) return this.handleError(message);
      return new Promise(resolve => this.setState({ submitting: false, message: '' }, resolve));
    } catch (err) {
      console.log(err);
      return this.handleError();
    }
  }
  /**
   * @returns {Promise<undefined>} triggers user typing subscription
   */
  sendUserTyping() {
    return this.props.sendUserTyping().catch(console.error);
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="message-input-wrapper flex-column">
        {this.state.userTyping && (
          <span className="user-typing">
            {this.props.user.username} is typing...
          </span>
        )}
        <div className="message-input display-flex">
          <Textarea
            placeholder="Write your message here"
            value={this.state.message}
            onChange={this.handleMessageChange}
            onKeyDown={this.handleEnterPress}
            disabled={this.state.submitting}
          />
          <div className="message-send-button-container display-flex justify-content-center">
            <button
              className="message-send-button"
              disabled={!this.state.message}
              onClick={this.handleSubmit}
            >
              <i className="fa fa-send" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

MessageInput.propTypes = {
  match: PropTypes.shape(),
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }),
  client: PropTypes.shape({
    subscribe: PropTypes.func,
  }),
  sendUserTyping: PropTypes.func,
  createMessage: PropTypes.func,
  clearError: PropTypes.func,
  addError: PropTypes.func,
};

export default compose(
  withApollo,
  withRouter,
  connect(null, { addError, clearError }),
  graphql(
    USER_TYPING_MUTATION,
    { name: 'sendUserTyping' },
  ),
  graphql(
    CREATE_MESSAGE_MUTATION,
    { name: 'createMessage' },
  ),
)(MessageInput);
