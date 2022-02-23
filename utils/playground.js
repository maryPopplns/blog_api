const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require(path.join(__dirname, '../config/database'));
const User = require(path.join(__dirname, '../models/user'));
const BlogPost = require(path.join(__dirname, '../models/blogPost'));
const { logger } = require(path.join(__dirname, '../logger/logger.js'));

function createUser() {
  bcrypt.genSalt(10, function (error, salt) {
    if (error) {
      return logger.error('generating salt error: ', error);
    }
    bcrypt.hash('1234', salt, function (error, hash) {
      if (error) {
        return logger.error('generating hash error: ', error);
      }
      User.create(
        {
          username: 'spencer1',
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

// createUser();
// createBlogPost();

(function virtuals() {
  const query = '621672c4a13b66bea62d4b49';
  const update = {
    $inc: { likes: 1 },
  };
  const options = { upsert: true, new: true };
  // Find the document
  BlogPost.findOneAndUpdate(query, update, options, function (error, result) {
    if (error) {
      logger.error(`${error}`);
      mongoose.connection.close();
    } else {
      logger.info(result);
      mongoose.connection.close();
    }
  });
})();
