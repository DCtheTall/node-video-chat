/**
 * @param {Object} sequelize instance
 * @param {Object} DataTypes for Sequelize
 * @returns {Object} message_thread model
 */
function linkMessageThread(sequelize, DataTypes) {
  const MessageThread = sequelize.define('message_thread', {
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
    contact_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'contacts',
        key: 'id',
      },
    },
    lastMessageAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
  });

  MessageThread.associate = function associate(models) {
    MessageThread.belongsTo(models.user, {
      foreignKey: 'user_1',
      as: 'user1',
    });
    MessageThread.belongsTo(models.user, {
      foreignKey: 'user_2',
      as: 'user2',
    });
    MessageThread.belongsTo(models.contact, {
      foreignKey: 'contact_id',
      as: 'contact',
    });
  };

  return MessageThread;
}

linkMessageThread.toString = () => 'message_thread';

export default linkMessageThread;
