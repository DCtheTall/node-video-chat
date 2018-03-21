import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import QUERY_CONTACTS from '../../graphql/queries/contacts/contacts.graphql';
import Loader from '../Layout/Loader';
import Contact from './ContactList/Contact';
import Headroom from './ContactList/Headroom';
import '../../styles/contact-list.scss';

/**
 * @class ContactList
 * @extends {React.PureComponent}
 */
class ContactList extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="contact-list-container full-height">
        <Headroom />
        <div className="contact-list">
          {this.props.contacts.loading ? (
            <Loader />
          ) : this.props.contacts.data.map(props => (
            <Contact key={props.id} {...props} />
          ))}
        </div>
      </div>
    );
  }
}

ContactList.propTypes = {
  contacts: PropTypes.shape({
    loading: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

export default graphql(
  QUERY_CONTACTS,
  { name: 'contacts' },
)(ContactList);
