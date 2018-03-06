/**
 * @param {Express.Request} req the request
 * @param {string} query the search query
 * @returns {Object} user instance
 */
export default async function searchForNewContactRequest(req, query) {
  const iLike = { $iLike: `%${query}%` };
  const users = await models.user.findAll({
    where: {
      id: { $not: req.user.id },
      $or: [
        { email: iLike },
        { username: iLike },
      ],
    },
  });
  return users;
}
