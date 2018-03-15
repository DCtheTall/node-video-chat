/**
 * @param {Object} sequelize instance
 * @param {Object} DataTypes for Sequelize
 * @returns {Object} contact_request model
 */
function linkContact(sequelize, DataTypes) {
  const Contact = sequelize.define('contact', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    user_1: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    user_2: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    blocker_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
  });

  Contact.associate = function associate(models) {
    Contact.belongsTo(models.user, {
      foreignKey: 'user_1',
      as: 'user1',
    });
    Contact.belongsTo(models.user, {
      foreignKey: 'user_2',
      as: 'user2',
    });
  };

  return Contact;
}

linkContact.toString = () => 'contact';

export default linkContact;
