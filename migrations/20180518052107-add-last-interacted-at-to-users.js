'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'lastInteractedAt', {
    type: Sequelize.DATE,
  }),
  down: queryInterface => queryInterface.removeColumn('users', 'lastInteractedAt'),
};
