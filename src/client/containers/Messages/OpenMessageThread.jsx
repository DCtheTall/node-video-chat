import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import QUERY_OPEN_MESSAGE_THREAD from '../../graphql/queries/message-threads/open-thread.graphql';
import { MESSAGES_ROUTE } from '../../constants';
import Loader from '../../components/Layout/Loader';
import Headroom from '../../components/Messages/OpenMessageThread/Headroom';
import Messages from '../../components/Messages/OpenMessageThread/Messages';
import MessageInput from '../../components/Messages/OpenMessageThread/MessageInput';

/**
 * @class OpenMessageThread
 * @extends {React.PureComponent}
 */
class OpenMessageThread extends React.PureComponent {
  /**
   * @returns {undefined}
   */
  componentDidUpdate() {
    if (!this.props.openMessageThread.loading && !this.props.openMessageThread.data) {
      this.props.history.push(MESSAGES_ROUTE);
    }
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    if (!this.props.openMessageThread.data) {
      return (
        <div className="full-height flex-center">
          <Loader />
        </div>
      );
    }
    return (
      <div className="full-height flex-column">
        <Headroom {...this.props.openMessageThread.data.user} />
        <Messages />
        <MessageInput />
      </div>
    );
  }
}

OpenMessageThread.propTypes = {
  history: PropTypes.shape(),
  openMessageThread: PropTypes.shape({
    loading: PropTypes.bool,
    data: PropTypes.shape({
      user: PropTypes.shape(),
    }),
  }),
};

export default graphql(
  QUERY_OPEN_MESSAGE_THREAD,
  {
    name: 'openMessageThread',
    options: props => ({
      variables: { threadId: props.match.params.id },
    }),
  },
)(OpenMessageThread);
