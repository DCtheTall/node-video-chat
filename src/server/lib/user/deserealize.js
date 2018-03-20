import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import userIncludeConfig from './include-config';

/**
 * Express middleware
 * @param {Express.Request} req request
 * @param {Express.Response} res response
 * @param {function} next callback on completion
 * @returns {undefined}
 */
export default async function deserealizeUser(req, res, next) {
  try {
    req.cookies = new Cookies(req, res, { keys: [new Buffer(process.env.COOKIE_SECRET, 'utf-8')] });
    const token = req.cookies.get(process.env.COOKIE_KEY, { signed: true }) || '';
    if (!token) return next();
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.user.findById(id, {
      order: [
        [{ model: models.contact_request, as: 'contactRequestsReceived' }, 'createdAt', 'DESC'],
      ],
      include: userIncludeConfig,
    });
    req.user = user;
  } catch (err) {
    console.log(err);
  }
  return next();
}

export async function subscriptionServer() {
}
