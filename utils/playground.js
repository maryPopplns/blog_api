const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require(path.join(__dirname, '../config/database'));
const User = require(path.join(__dirname, '../models/user'));
const { logger } = require(path.join(__dirname, '../logger/logger.js'));

function createUser() {
  bcrypt.genSalt(10, function (error, salt) {
    if (error) {
      return logger.error('generating salt', error);
    }
    bcrypt.hash('123', salt, function (error, hash) {
      if (error) {
        return logger.error('generating hash', error);
      }
      User.create(
        {
          username: 'spencer',
          password: hash,
        },
        function (error, user) {
          if (error) {
            mongoose.connection.close();
            return logger.error(error);
          }
          logger.info('added to db', user);
          mongoose.connection.close();
        }
      );
    });
  });
}
// createUser()
