import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setContactsQuery } from '../../actions/contacts';
import SearchBar from '../shared/SearchBar';
import '../../styles/contacts-headroom.scss';

/**
 * @class Headroom
 * @extends {React.PureComponent}
 */
class Headroom extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="contact-list-headroom text-center">
        <div className="webchat-text">
          Your Contacts
        </div>
        <div className="contacts-search flex-column align-items-center">
          <div className="user-search-bar">
            <SearchBar
              placeholder="Search your contacts"
              value={this.props.query}
              onChange={this.props.setContactsQuery}
            />
          </div>
        </div>
      </div>
    );
  }
}

Headroom.propTypes = {
  query: PropTypes.string,
  setContactsQuery: PropTypes.func,
};

export default connect(
  state => ({ query: state.contacts.query }),
  { setContactsQuery },
)(Headroom);
