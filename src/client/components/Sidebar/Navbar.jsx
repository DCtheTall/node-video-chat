import React from 'react';
import NavLink from '../../components/Sidebar/Navbar/NavLink';
import { CONTACTS_ROUTE, MESSAGES_ROUTE, CONTACT_REQUESTS_ROUTE } from '../../constants';
import '../../styles/navbar.scss';

const linkProps = [
  { to: CONTACTS_ROUTE, icon: 'address-book-o' },
  { to: MESSAGES_ROUTE, icon: 'comments-o' },
  { to: CONTACT_REQUESTS_ROUTE, icon: 'user-plus' },
];

/**
 * @class Navbar
 * @extends {React.PureComponent}
 */
class Navbar extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="navbar display-flex">
        {linkProps.map(props => (
          <NavLink {...props} />
        ))}
      </div>
    );
  }
}

export default Navbar;
