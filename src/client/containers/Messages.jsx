import React from 'react';
import { renderRoutes } from 'react-router-config';
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
      <Sidebar>
        {renderRoutes(routes)}
      </Sidebar>
    );
  }
}

Messages.propTypes = {};

export default Messages;
