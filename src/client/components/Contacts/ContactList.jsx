import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'redux';
import QUERY_CONTACTS from '../../graphql/queries/contacts/contacts.graphql';
import Loader from '../Layout/Loader';
import Contact from './ContactList/Contact';
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
        <div className="contact-list">
          {this.props.contacts.loading ? (
            <Loader />
          ) : this.props.contactData.map(props => (
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
    )),
  };
};

export default compose(
  graphql(
    QUERY_CONTACTS,
    { name: 'contacts' },
  ),
  connect(mapStateToProps),
)(ContactList);
