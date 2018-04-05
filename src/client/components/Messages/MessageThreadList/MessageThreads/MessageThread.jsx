import React from 'react';
import { shape, number, string } from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { GET_MESSAGE_THREAD_ROUTE } from '../../../../constants';
import UserInfo from '../../../shared/UserInfo';
import formatDate from '../../../../helpers/format-date';
import '../../../../styles/message-thread.scss';

/**
 * @class MessageThread
 * @extends {React.PureComponent}
 */
class MessageThread extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <Link
        className="message-thread-link"
        to={GET_MESSAGE_THREAD_ROUTE(this.props.id)}
      >
        <div
          className={classNames(
            'message-thread',
            'display-flex',
            'align-items-center',
            (
              this.props.latestMessage.senderId !== this.props.currentUserId
              && !this.props.latestMessage.readAt
              && 'unread-message'
            )
          )}
        >
          <UserInfo
            {...this.props.user}
            message={this.props.latestMessage.shortenedBody}
          />
          <div classMame="formatted-date">
            {formatDate(this.props.latestMessage.createdAt)}
          </div>
        </div>
      </Link>
    );
  }
}

MessageThread.propTypes = {
  id: number,
  user: shape(),
  shortenedBody: string,
  latestMessage: shape({
    shortenedBody: string,
    senderId: number,
    readAt: string,
  }),
  currentUserId: number,
};

export default MessageThread;
