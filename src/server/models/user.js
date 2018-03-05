import bcrypt from 'bcrypt';

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
function linkUser(sequelize, DataTypes) {
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
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    pictureUrl: {
      type: DataTypes.STRING,
      defaultValue: '/images/placeholder.jpg',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    classMethods: {
      generateHash,
    },
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

  User.associate = function addUserAssociations(models) {
    User.hasMany(models.contact_request, {
      foreignKey: 'sender_id',
      as: 'contactRequestsSent',
    });
    User.hasMany(models.contact_request, {
      foreignKey: 'recipient_id',
      as: 'contactRequestsReceived',
    });
  };

  return User;
}
linkUser.toString = () => 'user';

export default linkUser;
