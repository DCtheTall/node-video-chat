import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import QUERY_OPEN_MESSAGE_THREAD_ID from '../../graphql/queries/message-threads/open-thread-id.graphql';
import { MESSAGES_ROUTE } from '../../constants';
import Loader from '../../components/Layout/Loader';

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
    if (this.props.openMessageThread.loading) {
      return (
        <div className="full-height flex-center">
          <Loader />
        </div>
      );
    }
    return (
      <div className="full-height flex-column">
        Succeed
      </div>
    );
  }
}

OpenMessageThread.propTypes = {
  history: PropTypes.shape(),
  openMessageThread: PropTypes.shape({
    loading: PropTypes.bool,
    data: PropTypes.shape(),
  }),
};

export default graphql(
  QUERY_OPEN_MESSAGE_THREAD_ID,
  {
    name: 'openMessageThread',
    options: props => ({
      variables: { threadId: props.match.params.id },
    }),
  },
)(OpenMessageThread);
