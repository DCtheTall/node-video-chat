'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('contact_requests', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
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
      status: {
        allowNull: false,
        defaultValue: 'pending',
        type: Sequelize.ENUM(
          'pending',
          'accepted',
          'ignored',
          'expired',
        ),
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
  ),

  down: queryInterface => queryInterface.dropTable('contact_requests'),
};
