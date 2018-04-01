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
      <div className="open-messages display-flex">
        {this.props.messages.map(message => (
          <Message key={message.id} {...message} />
        ))}
      </div>
    );
  }
}

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape()),
};

export default Messages;
