import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import QUERY_CONTACTS from '../../graphql/queries/contacts/contacts.graphql';

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
      <div />
    );
  }
}

ContactList.propTypes = {};

export default graphql(
  QUERY_CONTACTS,
  { name: 'contacts' },
)(ContactList);
