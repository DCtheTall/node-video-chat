import jwt from 'jsonwebtoken';
import userIncludeConfig from './include-config';

export default async function authenticate(req, res, next) {
  try {
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
