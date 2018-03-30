import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import Textarea from 'react-textarea-autosize';
import Promise from 'bluebird';
import { graphql, withApollo } from 'react-apollo';
import { compose } from 'redux';
import USER_TYPING_MUTATION from '../../../graphql/mutations/message-threads/user-typing.graphql';
import USER_TYPING_SUBSCRIPTION from '../../../graphql/subscriptions/messages/user-typing.graphql';
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
    this.state = { message: '', userTyping: false };
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.sendUserTyping = debounce(
      this.sendUserTyping.bind(this),
      300,
      { leading: true, tailing: false },
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
    .subscribe(
      () => new Promise((resolve) => {
        if (this.clearTypingMessageTimeout) clearTimeout(this.clearTypingMessageTimeout);
        return this.setState({ userTyping: true }, resolve);
      })
      .then(() => Promise.delay(100))
      .then(() => {
        if (this.clearTypingMessageTimeout) clearTimeout(this.clearTypingMessageTimeout);
        this.clearTypingMessageTimeout = setTimeout(() => this.setState({ userTyping: false }), 1500);
      })
    );
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
  handleEnter({ keyCode }) {
    return keyCode === 13 && this.handleSubmit();
  }
  /**
   * @returns {Promise<undefined>} submits message
   */
  async handeSubmit() {}
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
            onKeyDown={this.handleEnter}
          />
          <div className="message-send-button-container display-flex justify-content-center">
            <button
              className="message-send-button"
              disabled={!this.state.message}
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
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }),
  client: PropTypes.shape({
    subscribe: PropTypes.func,
  }),
  sendUserTyping: PropTypes.func,
};

export default compose(
  withApollo,
  graphql(
    USER_TYPING_MUTATION,
    { name: 'sendUserTyping' },
  ),
)(MessageInput);
