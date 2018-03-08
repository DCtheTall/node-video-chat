import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import debounce from 'lodash.debounce';
import USER_SEARCH_QUERY from '../../graphql/queries/contact-requests/user-search.graphql';
import SearchResult from './SearchResults/SearchResult';
import '../../styles/contact-requests-search-results.scss';

/**
 * @class SearchResults
 * @extends {React.PureComponent}
 */
class SearchResults extends React.PureComponent {
  /**
   * @constructor
   * @constructs SearchResults
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.debouncedRefetch = debounce(
      this.debouncedRefetch.bind(this),
      300,
      { leading: false, tailing: true },
    );
  }
  /**
   * @param {Object} props before update
   * @returns {undefined}
   */
  componentDidUpdate(props) {
    if (props.query !== this.props.query) {
      this.debouncedRefetch();
    }
  }
  /**
   * @returns {undefined}
   */
  debouncedRefetch() {
    if (!this.props.data.loading) this.props.data.refetch({ query: this.props.query });
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    if (!this.props.data.users.length) return null;
    return (
      <div className="contact-requests-search-results flex-column">
        {[...this.props.data.users, ...this.props.data.users, ...this.props.data.users].map(user => (
          <SearchResult key={user.username} {...user} />
        ))}
      </div>
    );
  }
}

SearchResults.propTypes = {
  query: PropTypes.string,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    refetch: PropTypes.func,
    users: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

export default compose(
  connect(state => ({ query: state.contactRequests.query })),
  graphql(
    USER_SEARCH_QUERY,
    {
      options: {
        variables: { query: '' },
      },
    },
  ),
)(SearchResults);
