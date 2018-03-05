import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as Link } from 'react-router-dom';
import '../../../styles/navlink.scss';

/**
 * @class NavLink
 * @extends {React.PureComponent}
 */
class NavLink extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <Link
        to={this.props.to}
        className="navlink display-flex justify-content-center"
        activeClassName="active"
      >
        <i className={`fa fa-${this.props.icon}`} />
      </Link>
    );
  }
}

NavLink.propTypes = {
  to: PropTypes.string,
  icon: PropTypes.string,
};

export default NavLink;
