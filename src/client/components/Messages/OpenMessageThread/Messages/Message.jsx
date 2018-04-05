import React from 'react';
import { number, string, func, bool } from 'prop-types';
import classNames from 'classnames';
import { graphql } from 'react-apollo';
import READ_MESSAGE from '../../../../graphql/mutations/messages/read-message.graphql';
import formatDate from '../../../../helpers/format-date';
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
    const ReadAt = this.props.readAt && this.props.displayReadAt ? (
      <div className="read-at-message">
        Read {formatDate(this.props.readAt)}
      </div>
    ) : null;

    return (
      <div
        className={classNames(
          'open-message-wrapper flex-column',
          this.props.currentUserId === this.props.senderId && 'sent-by-current-user'
        )}
      >
        <div className="message">
          {this.props.body}
        </div>
        {ReadAt}
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
  displayReadAt: bool,
};

export default graphql(READ_MESSAGE, { name: 'readMessage' })(Message);
