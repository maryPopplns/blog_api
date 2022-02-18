const path = require('path');
const mongoose = require('mongoose');
require(path.join(__dirname, '/config/database'));
const User = require(path.join(__dirname, '/models/user'));
const { logger } = require(path.join(__dirname, '/logger/logger.js'));

User.create(
  {
    username: 'spencer',
    password: '123',
  },
  function (error, user) {
    if (error) {
      logger.error(`${error}`);
      mongoose.connection.close();
    } else {
      logger.info(`${user}`);
      mongoose.connection.close();
    }
  }
);

// create user
// use postman to test
