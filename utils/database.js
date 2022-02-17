const path = require('path');
const mongoose = require('mongoose');
const { logger } = require(path.join(__dirname, '../logger/logger'));

mongoose.connect(PROCESS.ENV.LOCAL_CONNECTION, {
  useNewUrlParser: 'true',
});

mongoose.connection.on('error', (error) => {
  logger.error('error', error);
});
mongoose.connection.on('connected', (error, res) => {
  logger.info('database is connected');
});
