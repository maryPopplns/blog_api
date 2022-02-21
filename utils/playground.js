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
    bcrypt.hash('123', salt, function (error, hash) {
      if (error) {
        return logger.error('generating hash error: ', error);
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

async function createBlogPost() {
  let userID;
  await User.find()
    .then((user) => {
      userID = user;
    })
    .catch((error) => logger.error(error));
  await BlogPost.create(
    {
      author: userID[0].id,
      title: 'this is the title',
      body: 'this is the body',
    },
    function (error, blogPost) {
      if (error) {
        mongoose.connection.close();
        return logger.error(`${error}`);
      }
      logger.info('success', `${blogPost}`);
      mongoose.connection.close();
    }
  );
}

// createUser()
createBlogPost();
