import React from 'react';
import { number, string, func, bool } from 'prop-types';
import classNames from 'classnames';
import { graphql } from 'react-apollo';
import moment from 'moment';
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
   * @returns {string} formatted read at text for message
   */
  formattedReadAt() {
    let format;
    switch (true) {
      case moment(this.props.readAt).isAfter(moment().startOf('day')):
        format = 'H:mm a';
        break;

      case moment(this.props.readAt).isAfter(moment().startOf('week')):
        format = 'ddd';
        break;

      default:
        format = 'MMM D';
    }
    return `Read ${moment(this.props.readAt).format(format)}`;
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    const ReadAt = this.props.readAt && this.props.displayReadAt ? (
      <div className="read-at-message">
        {this.formattedReadAt()}
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
