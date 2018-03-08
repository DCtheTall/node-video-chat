import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchBar from '../shared/SearchBar';
import { setContactRequestSearchQuery } from '../../actions/contact-requests';
import '../../styles/contact-requests-headroom.scss';

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
      <div className="contact-requests-headroom flex-column align-items-center">
        <div className="contact-requests-heading webchat-text text-center">
          Contact Requests
        </div>
        <div className="contact-requests-search flex-column align-items-center">
          <div className="user-search-bar">
            <SearchBar
              placeholder="Search users to add contacts"
              value={this.props.query}
              onChange={this.props.setContactRequestSearchQuery}
            />
          </div>
        </div>
      </div>
    );
  }
}

Headroom.propTypes = {
  query: PropTypes.string,
  setContactRequestSearchQuery: PropTypes.func,
};

const mapStateToProps = state => ({
  query: state.contactRequests.query,
});
const mapDispatchToProps = {
  setContactRequestSearchQuery,
};

export default connect(mapStateToProps, mapDispatchToProps)(Headroom);
