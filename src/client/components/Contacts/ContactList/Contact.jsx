import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/contact.scss';

/**
 * @class Contact
 * @extends {React.PureComponent}
 */
class Contact extends React.PureComponent {
  startVideoChat() {}
  openTextChat() {}
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="contact-container display-flex">
        <div className="user display-flex align-items-center">
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
          <button onClick={this.startVideoChat}>
            <i className="fa fa-video-camera" />
          </button>
          <button onClick={this.openTextChat}>
            <i className="fa fa-comments" />
          </button>
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
  }),
};

export default Contact;
