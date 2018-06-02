if (!process.env.NODE_ENV) require('dotenv').load(); // eslint-disable-line

const config = {
  development: {
    dialect: 'postgres',
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
  },
  production: {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    use_env_variable: 'DATABASE_URL',
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'sequelize_migrations',
  },
};

module.exports = config[process.env.NODE_ENV];
