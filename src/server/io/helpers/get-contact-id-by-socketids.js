import { Op } from 'sequelize';
import getSocketById from './get-socket-by-id';

/**
 * @param {string} socketId1 first socketId
 * @param {string} socketId2 2nd socketId
 * @returns {number} contactid associated to that socketId pair
 */
export default async function getContactIdBySocketId(io, socketId1, socketId2) {
  const socket1 = getSocketById(io, socketId1);
  if (!socket1) throw new Error(`Cannot find socket ${socketId1} in getContactIdBySocketId`);
  const socket2 = getSocketById(io, socketId2);
  if (!socket2) throw new Error(`Cannot find socket ${socketId2} in getContactIdBySocketId`);
  const userId1 = socket1.decoded_token.id;
  const userId2 = socket2.decoded_token.id;
  const contact = await models.contact.findOne({
    where: {
      user_1: { [Op.or]: [userId1, userId2] },
      user_2: { [Op.or]: [userId1, userId2] },
    },
    attributes: ['id'],
  });
  return contact.id;
}
