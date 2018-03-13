import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import NavLink from '../../components/Sidebar/Navbar/NavLink';
import QUERY_PENDING_CONTACT_REQUEST_IDS from '../../graphql/queries/contact-requests/pending-request-ids.graphql';
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
   * @constructor
   * @constructs Navbar
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.setNotifCounts();
  }
  /**
   * @returns {undefined}
   */
  componentDidUpdate() {
    this.setNotifCounts();
  }
  /**
   * @returns {undefined}
   */
  setNotifCounts() {
    this.notifCounts = [
      0,
      0,
      this.props.pendingRequestIds,
    ].map(({ data }) => Number(data && data.length))
     .map(n => ((n > 99 && '99+') || (n && String(n)) || ''));
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="navbar display-flex">
        {linkProps.map((props, i) => (
          <NavLink
            {...props}
            key={props.to}
            notifs={this.notifCounts[i]}
          />
        ))}
      </div>
    );
  }
}

Navbar.propTypes = {
  pendingRequestIds: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

export default graphql(
  QUERY_PENDING_CONTACT_REQUEST_IDS,
  { name: 'pendingRequestIds' },
)(Navbar);
