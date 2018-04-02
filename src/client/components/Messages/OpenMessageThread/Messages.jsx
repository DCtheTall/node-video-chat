import React from 'react';
import PropTypes from 'prop-types';
import StayScrolled from 'react-stay-scrolled';
import Message from './Messages/Message';
import '../../../styles/open-messages.scss';

/**
 * @class Messages
 * @extends {React.PureComponent}
 */
class Messages extends React.PureComponent {
  /**
   * @param {Object} props before update
   * @returns {undefined}
   */
  componentDidUpdate(props) {
    if (props.messages.length < this.props.messages.length) {
      this.scrollBottom();
    }
  }
  storeScrolledControllers = ({ stayScrolled, scrollBottom }) => {
    this.stayScrolled = stayScrolled;
    this.scrollBottom = scrollBottom;
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="open-messages-container display-flex flex-column">
        <StayScrolled
          provideControllers={this.storeScrolledControllers}
          component="div"
          className="open-messages"
        >
          {this.props.messages.map(message => (
            <Message
              key={message.id}
              currentUserId={this.props.currentUserId}
              {...message}
            />
          ))}
        </StayScrolled>
      </div>
    );
  }
}

Messages.propTypes = {
  currentUserId: PropTypes.number,
  messages: PropTypes.arrayOf(PropTypes.shape()),
};

export default Messages;
