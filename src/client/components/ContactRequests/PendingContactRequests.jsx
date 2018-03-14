import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import QUERY_PENDING_CONTACT_REQUESTS from '../../graphql/queries/contact-requests/pending-requests.graphql';
import PendingContactRequest from './PendingContactRequests/PendingContactRequest';

/**
 * @class PendingContactRequests
 * @extends {React.PureComponent}
 */
class PendingContactRequests extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    if (!this.props.pendingRequests.data || !this.props.pendingRequests.data.length) return null;
    return (
      <div className="pending-contact-requests">
        {this.props.pendingRequests.data.map(request => (
          <PendingContactRequest key={request.id} {...request} />
        ))}
      </div>
    );
  }
}

PendingContactRequests.propTypes = {
  pendingRequests: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

export default graphql(
  QUERY_PENDING_CONTACT_REQUESTS,
  {
    name: 'pendingRequests',
    options: { pollInterval: 5000 },
  },
)(PendingContactRequests);
