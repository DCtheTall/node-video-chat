import Cookies from 'cookies';
import jwt from 'jsonwebtoken';

/**
 * Express middleware
 * @param {Express.Request} req request
 * @param {Express.Response} res response
 * @param {function} next callback on completion
 * @returns {undefined}
 */
export default async function deserealizeUser(req, res, next) {
  let id;
  try {
    req.cookies = new Cookies(req, res, { keys: [new Buffer(process.env.COOKIE_SECRET, 'utf-8')] });
    const token = req.cookies.get(process.env.COOKIE_KEY, { signed: true }) || '';
    if (!token) return next();
    const { id: tmp } = await jwt.verify(token, process.env.JWT_SECRET);
    id = tmp;
    const user = await models.user.findById(id);
    req.cookies.set(process.env.COOKIE_KEY, token, { signed: true, maxAge: Date.now() + (24 * 60 * 60 * 1e3) });
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return next();
  }
  try {
    return await models.user.update({ lastInteractedAt: new Date() }, { where: { id } });
  } catch (err) {
    return console.log(err);
  }
}
