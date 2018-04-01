import React from 'react';
import { string } from 'prop-types';

/**
 * @class Message
 * @extends {React.PureComponent}
 */
class Message extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="message">
        {this.props.body}
      </div>
    );
  }
}

Message.propTypes = {
  body: string,
};

export default Message;
