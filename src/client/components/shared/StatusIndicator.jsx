import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';
import '../../styles/status-indicator.scss';

/**
 * StatusIndiciator Stateless Functional Component
 * @param {Object} props Component props
 * @returns {JSX.Element} HTML
 */
function StatusIndicator({ status }) {
  return (
    <div className={classNames('status-indicator', status)} />
  );
}

StatusIndicator.propTypes = {
  status: string,
};

export default StatusIndicator;
