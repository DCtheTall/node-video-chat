import React from 'react';
import { number, string } from 'prop-types';
import classNames from 'classnames';
import '../../../../styles/open-message.scss';

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
      <div
        className={classNames(
          'open-message-wrapper display-flex align-items-center',
          this.props.currentUserId === this.props.senderId && 'sent-by-current-user'
        )}
      >
        <div className="message">
          {this.props.body}
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  currentUserId: number,
  senderId: number,
  body: string,
};

export default Message;
