import React from 'react';
import PropTypes from 'prop-types';
import ChatContainer from './Layout/ChatContainer';
import Sidebar from './Layout/Sidebar';

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
        <Sidebar />
      </div>
    );
  }
}

ContactRequests.propTypes = {};

export default ContactRequests;
