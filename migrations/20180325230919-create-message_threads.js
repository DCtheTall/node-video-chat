'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('message_threads', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_1: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      user_2: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      contact_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'contacts',
          key: 'id',
        },
      },
      lastModifiedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
  ),

  down: queryInterface => queryInterface.dropTable('message_threads'),
};
