import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import debounce from 'lodash.debounce';
import USER_SEARCH_QUERY from '../../graphql/queries/contact-requests/user-search.graphql';
import SearchBar from '../shared/SearchBar';
import SearchResult from './UserSearch/SearchResult';
import '../../styles/user-search.scss';

/**
 * @class ContactRequestSearch
 * @extends {React.PureComponent}
 */
class UserSearch extends React.PureComponent {
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
   * @param {string} query new query value
   * @returns {undefined}
   */
  handleSearchChange(query) {
    this.setState({ query });
    this.submitSearch();
  }
  /**
   * @returns {undefined}
   */
  submitSearch() {
    this.props.data.refetch({
      query: this.state.query,
    });
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="user-search flex-column align-items-center">
        <div className="user-search-bar">
          <SearchBar
            placeholder="Search users to add contacts"
            value={this.state.query}
            onChange={this.handleSearchChange}
          />
        </div>
        <div className="user-search-results">
          {this.props.data.users && this.props.data.users.map(user => (
            <SearchResult key={user.username} {...user} />
          ))}
        </div>
      </div>
    );
  }
}

UserSearch.propTypes = {
  data: PropTypes.shape({
    refetch: PropTypes.func,
    users: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

export default graphql(
  USER_SEARCH_QUERY,
  {
    options: {
      variables: { query: '' },
    },
  },
)(UserSearch);
