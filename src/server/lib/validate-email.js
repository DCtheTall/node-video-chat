import { isEmail } from 'validator';
import dns from 'dns';
import Promise from 'bluebird';

const resolveMx = Promise.promisify(dns.resolveMx, { context: dns });

/**
 * @param {string} emailAddr to validate with mx lookup
 * @returns {Object} { success } is true if email is valid
 */
export default async function validateEmail(emailAddr) {
  if (!isEmail(emailAddr)) return { success: false };
  try {
    const result = await resolveMx(emailAddr.split('@')[1]);
    return { success: Boolean(result.length) };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
}
