import React from 'react';
// import PropTypes from 'prop-types';
import Navbar from '../../components/Sidebar/Navbar';
import '../../styles/sidebar.scss';

/**
 * @class Sidebar
 * @extends {React.PureComponent}
 */
class Sidebar extends React.PureComponent {
  /**
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="sidebar-container">
        <Navbar />
      </div>
    );
  }
}

Sidebar.propTypes = {};

export default Sidebar;
