require('dotenv').config();
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check } = require('express-validator');
const { logger } = require(path.join(__dirname, '../logger/logger'));

// [ CREAT BLOG POST ]
exports.createPost = [
  check('title').trim().escape(),
  check('body').trim().escape(),
  function (req, res, next) {
    passport.authenticate(
      'jwt',
      { session: false },
      function (error, user, info) {
        if (error) {
          next(error);
        } else if (!user) {
          res.json({ message: 'please log in to create posts' });
        } else {
          res.json({ user: user[0] });

          // TODO create the blog post and save it
          // TODO respond that the blog was saved successfully
        }
      }
    )(req, res);
  },
];
