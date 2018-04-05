import moment from 'moment';

/**
 * @param {Date|string} date to format
 * @returns {string} formatted date string
 */
export default function formatDate(date) {
  let format;
  switch (true) {
    case moment(date).isAfter(moment().startOf('day')):
      format = 'h:mm a';
      break;

    case moment(date).isAfter(moment().startOf('week')):
      format = 'ddd';
      break;

    default:
      format = 'MMM D';
  }
  return moment(date).format(format);
}
