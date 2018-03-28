import React from 'react';
import { renderRoutes } from 'react-router-config';
import ChatContainer from './Layout/ChatContainer';
import Sidebar from './Layout/Sidebar';
import routes from '../routes/messages';

/**
 * @class Messages
 * @extends {React.PureComponent}
 */
class Messages extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="app-content display-flex">
        <ChatContainer />
        <Sidebar>
          {renderRoutes(routes)}
        </Sidebar>
      </div>
    );
  }
}

Messages.propTypes = {};

export default Messages;
