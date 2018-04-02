import React from 'react';
import { number, string, func } from 'prop-types';
import classNames from 'classnames';
import { graphql } from 'react-apollo';
import READ_MESSAGE from '../../../../graphql/mutations/messages/read-message.graphql';
import '../../../../styles/open-message.scss';

/**
 * @class Message
 * @extends {React.PureComponent}
 */
class Message extends React.PureComponent {
  /**
   * @returns {undefined}
   */
  componentDidMount() {
    if (!this.props.readAt) {
      this.props.readMessage({
        variables: { messageId: this.props.id },
      });
    }
  }
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
  id: number,
  currentUserId: number,
  senderId: number,
  body: string,
  readAt: string,
  readMessage: func,
};

export default graphql(READ_MESSAGE, { name: 'readMessage' })(Message);
