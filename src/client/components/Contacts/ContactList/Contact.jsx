import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { compose } from 'redux';
import QUERY_MESSAGE_THREADS from '../../../graphql/queries/message-threads/message-threads.graphql';
import CREATE_MESSAGE_THREAD from '../../../graphql/mutations/message-threads/create.graphql';
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
  openTextChat() {
    const messageThread = this.props.messageThreads.data &&
      this.props.messageThreads.data.find(({ user }) => user.id === this.props.user.id);
    if (messageThread) return null; // Handle later
    return this.props.createMessageThread({
      variables: { contactId: this.props.id },
      refetchQueries: [{ query: QUERY_MESSAGE_THREADS }],
    });
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
  createMessageThread: PropTypes.func,
};

export default compose(
  graphql(
    QUERY_MESSAGE_THREADS,
    { name: 'messageThreads' },
  ),
  graphql(
    CREATE_MESSAGE_THREAD,
    { name: 'createMessageThread' },
  ),
)(Contact);
