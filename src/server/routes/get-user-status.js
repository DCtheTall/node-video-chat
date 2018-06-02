import { getSocketByUserId } from '../io/helpers';

/**
 * getUserStatus
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
async function getUserStatus(req, res) {
  try {
    const socket = await getSocketByUserId(Number(req.params.userid), req.app.io);
    if (socket) res.json({ status: 'available' });
    else res.json({ status: 'offline' });
  } catch (err) {
    console.log(err);
    res.json({ status: 'offline' });
  }
}

module.exports = getUserStatus;
