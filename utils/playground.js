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

// (function userLikes() {
//   const update = { $pullAll: { likes: [{ _id: '6216a7367b02b12d7976d68a' }] } };
//   const query = { _id: '6216a70f3969117d4f89d7ad' };
//   // const update = { $push: { likes: '6216a7367b02b12d7976d68a' } };
//   const options = { upsert: true, new: true };
//   // Find the document
//   User.findOneAndUpdate(query, update, options, function (error, result) {
//     if (error) {
//       logger.error(`${error}`);
//       mongoose.connection.close();
//     } else {
//       logger.info(result);
//       mongoose.connection.close();
//     }
//   });
// })();
