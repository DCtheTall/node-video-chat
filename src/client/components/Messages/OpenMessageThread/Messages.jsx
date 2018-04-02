import React from 'react';
import PropTypes from 'prop-types';
import Message from './Messages/Message';
import '../../../styles/open-messages.scss';

/**
 * @class Messages
 * @extends {React.PureComponent}
 */
class Messages extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="open-messages-container display-flex flex-column">
        <div className="open-messages" ref={node => this.openMessage = node}>
          {this.props.messages.map(message => (
            <Message
              key={message.id}
              currentUserId={this.props.currentUserId}
              {...message}
            />
          ))}
        </div>
      </div>
    );
  }
}

Messages.propTypes = {
  currentUserId: PropTypes.number,
  messages: PropTypes.arrayOf(PropTypes.shape()),
};

export default Messages;
