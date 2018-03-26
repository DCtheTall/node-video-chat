import React from 'react';
import PropTypes from 'prop-types';
import UserInfo from '../../shared/UserInfo';
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
        <UserInfo {...this.props.user} />
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
