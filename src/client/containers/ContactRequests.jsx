import React from 'react';
import Sidebar from './Layout/Sidebar';
import Headroom from '../components/ContactRequests/Headroom';
import SearchResults from '../components/ContactRequests/SearchResults';
import PendingContactRequests from '../components/ContactRequests/PendingContactRequests';

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
      <Sidebar>
        <div className="position-relative full-height">
          <Headroom />
          <SearchResults />
          <PendingContactRequests />
        </div>
      </Sidebar>
    );
  }
}

ContactRequests.propTypes = {};

export default ContactRequests;
