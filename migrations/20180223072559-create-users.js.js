module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: Sequelize.STRING,
      pictureUrl: {
        type: Sequelize.STRING,
        defaultValue: '/images/placeholder.jpg',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    }),

  down: queryInterface => queryInterface.dropTable('users'),
};
