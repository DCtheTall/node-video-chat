import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import debounce from 'lodash.debounce';
import USER_SEARCH_QUERY from '../../graphql/queries/user/search-users.graphql';
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
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.submitSearch = debounce(this.submitSearch.bind(this), 300, { leading: false, tailing: true });
  }
  /**
   * temp
   */
  componentDidUpdate() {
    console.log(this.props.data.users);
  }
  /**
   * @returns {undefined}
   */
  handleSearchChange({ target: { value } }) {
    this.setState({ query: value });
    this.submitSearch();
  }
  /**
   * @returns {undefined}
   */
  submitSearch() {
    this.props.data.refetch({
      query: this.state.query,
      searchType: 'NEW_CONTACT_REQUEST',
    });
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

ContactRequestSearch.propTypes = {
  data: PropTypes.shape({
    refetch: PropTypes.func,
  }),
};

export default graphql(
  USER_SEARCH_QUERY,
  {
    options: {
      variables: { query: '', searchType: 'NEW_CONTACT_REQUEST' },
    },
  },
)(ContactRequestSearch);
