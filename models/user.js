/**
 * @param {Object} sequelize instance
 * @param {Object} DataTypes for Sequelize
 * @returns {Object} user model
 */
function linkUser(sequelize, DataTypes) { // eslint-disable-line
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  });
  return User;
}
linkUser.toString = () => 'user';

module.exports = linkUser;
