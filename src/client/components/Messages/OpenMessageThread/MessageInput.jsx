import React from 'react';
import PropTypes from 'prop-types';
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
    this.state = { message: '' };
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }
  /**
   * @param {Object} event onchange event
   * @returns {undefined}
   */
  handleMessageChange({ target: { value } }) {
    this.setState({ message: value });
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="message-input display-flex">
        <textarea
          rows="1"
          placeholder="Write your message here"
          value={this.state.message}
          onChange={this.handleMessageChange}
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
    );
  }
}

MessageInput.propTypes = {};

export default MessageInput;
