import React from 'react';
import ChatContainer from './Layout/ChatContainer';
import Sidebar from './Layout/Sidebar';
import UserSearch from '../components/ContactRequests/UserSearch';
import '../styles/contact-requests.scss';

/**
 * @class ContactRequests
 * @extends {React.PureComponent}
 */
class ContactRequests extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="app-content display-flex">
        <ChatContainer />
        <Sidebar>
          <div className="contact-request-headroom flex-column align-items-center">
            <div className="contact-request-heading webchat-text text-center">
              Contact Requests
            </div>
            <UserSearch />
          </div>
          test
        </Sidebar>
      </div>
    );
  }
}

ContactRequests.propTypes = {};

export default ContactRequests;
