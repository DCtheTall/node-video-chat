'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      body: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sender_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      thread_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'message_threads',
          key: 'id',
        },
      },
      readAt: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
  ),

  down: queryInterface => queryInterface.dropTable('messages'),
};
