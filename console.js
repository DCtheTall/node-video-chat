const repl = require('repl');
const models = require('./src/server/models');

const replConsole = repl.start('> ');
replConsole.context.models = models;
replConsole.on('exit', () => {
  models.sequelize.close();
  process.exit(0);
});
