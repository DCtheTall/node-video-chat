import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import QUERY_CONTACTS from '../../graphql/queries/contacts/contacts.graphql';
import { CONTACT_REQUESTS_ROUTE } from '../../constants';
import Loader from '../Layout/Loader';
import Contact from './ContactList/Contact';
import '../../styles/contact-list.scss';

/**
 * @class ContactList
 * @extends {React.PureComponent}
 */
class ContactList extends React.PureComponent {
  /**
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.contacts.refetch();
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="contact-list-container full-height">
        <div className="contact-list">
          {!this.props.contactData.length
            && this.props.contacts.loading
            && (
              <Loader />
            )
          }
          {!this.props.contacts.loading
            && !this.props.contactData.length
            && (
              <div className="no-contacts flex-column flex-center">
                <span>
                  No contacts yet
                </span>
                <Link to={CONTACT_REQUESTS_ROUTE}>
                  <button className="webchat-button">
                    ADD CONTACTS
                  </button>
                </Link>
              </div>
            )
          }
          {this.props.contactData.map(props => (
            <Contact key={props.id} {...props} />
          ))}
        </div>
      </div>
    );
  }
}

ContactList.propTypes = {
  contacts: PropTypes.shape({
    refetch: PropTypes.func,
    loading: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape()),
  }),
  contactData: PropTypes.arrayOf(PropTypes.shape()),
};

const mapStateToProps = (state, props) => {
  if (!props.contacts.data) return { contactData: [] };
  if (!state.contacts.query) return { contactData: props.contacts.data };
  const removeWhitespace = str => str.replace(/\s+/, '');
  const queryExp = new RegExp(removeWhitespace(state.contacts.query), 'i');
  return {
    contactData: props.contacts.data.filter(({ user }) => (
      queryExp.test(removeWhitespace(user.username))
      || queryExp.test(removeWhitespace(user.email))
    )).sort((a, b) => {
      if (a.user.status === 'available' && b.user.status === 'offline') return -1;
      if (a.user.status === 'offline' && b.user.status === 'available') return 1;
      if (a.user.username.toLowerCase().trim() < b.user.username.toLowerCase().trim()) return -1;
      if (b.user.username.toLowerCase().trim() < a.user.username.toLowerCase().trim()) return 1;
      return 0;
    }),
  };
};

export default compose(
  graphql(
    QUERY_CONTACTS,
    { name: 'contacts' },
  ),
  connect(mapStateToProps),
)(ContactList);
