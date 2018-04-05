import React from 'react';
import { shape, number, string } from 'prop-types';
import { Link } from 'react-router-dom';
import { GET_MESSAGE_THREAD_ROUTE } from '../../../../constants';
import UserInfo from '../../../shared/UserInfo';
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
        <div className="message-thread display-flex align-items-center">
          <UserInfo
            {...this.props.user}
            message={this.props.latestMessage.shortenedBody}
          />
        </div>
      </Link>
    );
  }
}

MessageThread.propTypes = {
  id: number,
  user: shape(),
  shortenedBody: string,
  latestMessage: shape({ shortenedBody: string }),
};

export default MessageThread;
