import React from 'react';
// import PropTypes from 'prop-types';
import '../../styles/chat-container.scss';

/**
 * @class ChatContainer
 * @extends {React.PureComponent}
 */
class ChatContainer extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="chat-container" />
    );
  }
}

ChatContainer.propTypes = {};

export default ChatContainer;
