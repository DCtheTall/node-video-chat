import React from 'react';
// import PropTypes from 'prop-types';
import Sidebar from './Layout/Sidebar';
import ContactList from '../components/Contacts/ContactList';
import Headroom from '../components/Contacts/Headroom';

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
      <Sidebar>
        <div className="position-relative full-height">
          <Headroom />
          <ContactList />
        </div>
      </Sidebar>
    );
  }
}

Contacts.propTypes = {};

export default Contacts;
