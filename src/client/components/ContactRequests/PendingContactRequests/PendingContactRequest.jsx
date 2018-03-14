import React from 'react';
import PropTypes from 'prop-types';

/**
 * @class PendingContactRequest
 * @extends {React.PureComponent}
 */
class PendingContactRequest extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="pending-contact-request display-flex">
        <div className="user-info display-flex align-items-center">
          <img
            src={this.props.sender.pictureUrl}
            alt={this.props.sender.username}
          />
          <div className="flex-column">
            <span className="username">
              {this.props.sender.username}
            </span>
            <span className="email">
              {this.props.sender.email}
            </span>
          </div>
        </div>
        <div className="responding-buttons flex-column align-items-center">
          <button>
            <i className="fa fa-plus" />
            &nbsp;
            <span className="webchat-text">
              Accept
            </span>
          </button>
          <button>
            &times;&nbsp;Ignore
          </button>
        </div>
      </div>
    );
  }
}

PendingContactRequest.propTypes = {
  id: PropTypes.number,
  sender: PropTypes.shape({
    pictureUrl: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default PendingContactRequest;
