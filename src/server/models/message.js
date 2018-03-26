/**
 * @param {Object} sequelize instance
 * @param {Object} DataTypes for Sequelize
 * @returns {Object} message_thread model
 */
function linkMessage(sequelize, DataTypes) {
  const Message = sequelize.define('message', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    recipient_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    thread_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'message_threads',
        key: 'id',
      },
    },
    read: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
  });

  Message.associate = function associate(models) {
    Message.belongsTo(models.sender_id, {
      as: 'sender',
      foreignKey: 'sender_id',
    });
    Message.belongsTo(models.recipient_id, {
      as: 'recipient',
      foreignKey: 'recipient_id',
    });
    Message.belongsTo(models.message_thread, {
      as: 'thread',
      foreignKey: 'thread_id',
    });
  };

  return Message;
}

linkMessage.toString = () => 'message';

export default linkMessage;
