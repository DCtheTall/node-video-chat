import { getSocketByUserId } from '../io/helpers';

/**
 * getUserStatus
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
export default async function getUserStatus(req, res) {
  try {
    const socket = await getSocketByUserId(Number(req.params.userid), req.app.io);
    if (socket) res.json({ socketId: socket.id });
    else res.json({ socketId: null });
  } catch (err) {
    console.log(err);
    res.json({ socketId: null });
  }
}
