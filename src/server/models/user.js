const bcrypt = require('bcrypt');

/**
 * @param {string} plaintext to create hash
 * @returns {string} hash
 */
async function generateHash(plaintext) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plaintext, salt);
  return hash;
}

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
    password: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    classMethods: { generateHash },
    hooks: {
      async beforeCreate(user) {
        user.email = user.email.toLowerCase();
        user.password = await generateHash(user.password);
      },
      async beforeUpdate(user) {
        if (user.changed('email')) user.email = user.email.toLowerCase();
        if (user.changed('password')) user.password = await generateHash(user.password);
      },
    },
  });

  User.prototype.validatePassword = function validatePassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
}
linkUser.toString = () => 'user';

module.exports = linkUser;
