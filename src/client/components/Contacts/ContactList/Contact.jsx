import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import QUERY_MESSAGE_THREADS from '../../../graphql/queries/message-threads/message-threads.graphql';
import CREATE_MESSAGE_THREAD from '../../../graphql/mutations/message-threads/create.graphql';
import { GET_MESSAGE_THREAD_ROUTE } from '../../../constants';
import { addError, clearError } from '../../../actions/error';
import UserInfo from '../../shared/UserInfo';
import '../../../styles/contact.scss';

/**
 * @class Contact
 * @extends {React.PureComponent}
 */
class Contact extends React.PureComponent {
  /**
   * @constructor
   * @constructs Contact
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.openTextChat = this.openTextChat.bind(this);
  }
  callContact() {}
  /**
   * @returns {Promise<undefined>} opens existing message thread between users or creates one
   */
  async openTextChat() {
    this.props.clearError();
    const messageThread = this.props.messageThreads.data &&
      this.props.messageThreads.data.find(({ user }) => user.id === this.props.user.id);
    if (messageThread) return this.props.history.push(GET_MESSAGE_THREAD_ROUTE(messageThread.id));
    const mutation = await this.props.createMessageThread({
      variables: { contactId: this.props.id },
      refetchQueries: [{ query: QUERY_MESSAGE_THREADS }],
    });
    const { data: { result } } = mutation;
    if (!result.success) this.props.addError(result.message);
    return this.props.history.push(GET_MESSAGE_THREAD_ROUTE(result.threadId));
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="contact-container display-flex">
        <UserInfo {...this.props.user} />
        <div className="controls display-flex align-items-center">
          {this.props.user.status === 'available' && (
            <button onClick={this.callContact}>
              <i className="fa fa-video-camera" />
            </button>
          )}
          <button onClick={this.openTextChat}>
            <i className="fa fa-comments" />
          </button>
        </div>
      </div>
    );
  }
}

Contact.propTypes = {
  id: PropTypes.number,
  user: PropTypes.shape({
    id: PropTypes.number,
    pictureUrl: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string,
  }),
  messageThreads: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape),
  }),
  history: PropTypes.shape(),
  addError: PropTypes.func,
  clearError: PropTypes.func,
  createMessageThread: PropTypes.func,
};

export default compose(
  withRouter,
  connect(null, { addError, clearError }),
  graphql(
    QUERY_MESSAGE_THREADS,
    { name: 'messageThreads' },
  ),
  graphql(
    CREATE_MESSAGE_THREAD,
    { name: 'createMessageThread' },
  ),
)(Contact);
