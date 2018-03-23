import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../../../styles/contact.scss';

/**
 * @class Contact
 * @extends {React.PureComponent}
 */
class Contact extends React.PureComponent {
  callContact() {}
  openTextChat() {}
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="contact-container display-flex">
        <div className="user display-flex align-items-center">
          <div className={classNames('status-indicator', this.props.user.status)} />
          <img
            src={this.props.user.pictureUrl}
            alt={this.props.user.username}
          />
          <div className="user-info flex-column">
            <span className="username">
              {this.props.user.username}
            </span>
            <span className="email">
              {this.props.user.email}
            </span>
          </div>
        </div>
        <div className="controls display-flex align-items-center">
          {this.props.user.status === 'available' && (
            <button onClick={this.callContact}>
              <i className="fa fa-video-camera" />
            </button>
          )}
          {this.props.user.status !== 'offline' && (
            <button onClick={this.openTextChat}>
              <i className="fa fa-comments" />
            </button>
          )}
        </div>
      </div>
    );
  }
}

Contact.propTypes = {
  user: PropTypes.shape({
    pictureUrl: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default Contact;
