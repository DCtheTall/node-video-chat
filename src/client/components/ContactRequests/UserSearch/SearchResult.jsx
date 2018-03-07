import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/user-search-result.scss';

/**
 * @class SearchResult
 * @extends {React.PureComponent}
 */
class SearchResult extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="contact-request-search-result display-flex align-items-center">
        <div className="user display-flex align-items-center">
          <img
            alt={this.props.username}
            src={this.props.pictureUrl}
          />
          <div className="user-info flex-column">
            <span className="username">
              {this.props.username}
            </span>
            <span className="email">
              {this.props.email}
            </span>
          </div>
        </div>
        <button className="webchat-button">
          <i className="fa fa-send" />
        </button>
      </div>
    );
  }
}

SearchResult.propTypes = {
  username: PropTypes.string,
  email: PropTypes.string,
  pictureUrl: PropTypes.string,
};

export default SearchResult;
