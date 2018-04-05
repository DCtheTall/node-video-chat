import React from 'react';
import { arrayOf, shape } from 'prop-types';
import MessageThread from './MessageThreads/MessageThread';
import '../../../styles/message-threads.scss';

/**
 * @class MessageThreads
 * @extends {React.PureComponent}
 */
class MessageThreads extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="message-threads display-flex flex-column">
        {this.props.threads.map(thread => (
          <MessageThread key={thread.id} {...thread} />
        ))}
      </div>
    );
  }
}

MessageThreads.propTypes = {
  threads: arrayOf(shape()),
};

export default MessageThreads;
