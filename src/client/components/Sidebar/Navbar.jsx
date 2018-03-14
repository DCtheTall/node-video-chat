import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import NavLink from '../../components/Sidebar/Navbar/NavLink';
import QUERY_PENDING_CONTACT_REQUESTS from '../../graphql/queries/contact-requests/pending-requests.graphql';
import { CONTACTS_ROUTE, MESSAGES_ROUTE, CONTACT_REQUESTS_ROUTE } from '../../constants';
import '../../styles/navbar.scss';

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
    this.state = {
      linkProps: [
        {
          to: CONTACTS_ROUTE,
          icon: 'address-book-o',
          dataKey: '',
          notifs: null,
        },
        {
          to: MESSAGES_ROUTE,
          icon: 'comments-o',
          dataKey: '',
          notifs: null,
        },
        {
          to: CONTACT_REQUESTS_ROUTE,
          icon: 'user-plus',
          dataKey: 'pendingRequests',
          notifs: null,
        },
      ],
    };
  }
  /**
   * @returns {undefined}
   */
  componentDidMount() {
    return this.setNotifCounts();
  }
  /**
   * @param {Object} props sent to component
   * @returns {undefined}
   */
  componentDidUpdate(props) {
    if (props !== this.props) this.setNotifCounts();
  }
  /**
   * @returns {undefined}
   */
  setNotifCounts() {
    this.setState({
      linkProps: this.state.linkProps.map(({ dataKey, ...linkProps }) => {
        let notifs = this.props[dataKey] && this.props[dataKey].data && this.props[dataKey].data.length;
        notifs = (notifs >= 99 && '99+') || (notifs && String(+notifs)) || '';
        return {
          ...linkProps,
          dataKey,
          notifs,
        };
      }),
    });
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="navbar display-flex">
        {this.state.linkProps.map(props => (
          <NavLink key={props.to} {...props} />
        ))}
      </div>
    );
  }
}

Navbar.propTypes = {
  pendingRequests: PropTypes.shape({
    refetch: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

export default graphql(
  QUERY_PENDING_CONTACT_REQUESTS,
  {
    name: 'pendingRequests',
    options: { pollInterval: 5000 },
  },
)(Navbar);
