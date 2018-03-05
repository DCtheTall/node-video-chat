import React from 'react';
import PropTypes from 'prop-types';
import ChatContainer from './Layout/ChatContainer';
import Sidebar from './Layout/Sidebar';

/**
 * @class Contacts
 * @extends {React.PureComponent}
 */
class Contacts extends React.PureComponent {
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

Contacts.propTypes = {};

export default Contacts;
