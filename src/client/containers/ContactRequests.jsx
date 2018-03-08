import React from 'react';
import ChatContainer from './Layout/ChatContainer';
import Sidebar from './Layout/Sidebar';
import Headroom from '../components/ContactRequests/Headroom';
import SearchResults from '../components/ContactRequests/SearchResults';

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
          <div>
            <Headroom />
            <SearchResults />
          </div>
        </Sidebar>
      </div>
    );
  }
}

ContactRequests.propTypes = {};

export default ContactRequests;
