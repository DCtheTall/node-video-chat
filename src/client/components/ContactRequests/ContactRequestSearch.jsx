import React from 'react';
// import PropTypes from 'prop-types';
import SearchBar from '../shared/SearchBar';
import '../../styles/contact-request-search.scss';

/**
 * @class ContactRequestSearch
 * @extends {React.PureComponent}
 */
class ContactRequestSearch extends React.PureComponent {
  /**
   * @constructor
   * @constructs ContactRequestSearch
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { query: '' };
  }
  /**
   * @returns {undefined}
   */
  handleSearchChange({ target: { value } }) {
    this.setState({ query: value });
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="contact-request-search">
        <SearchBar
          placeholder="Search users to add contacts"
          value={this.state.query}
          onChange={this.handleSearchChange}
        />
      </div>
    );
  }
}

ContactRequestSearch.propTypes = {};

export default ContactRequestSearch;
