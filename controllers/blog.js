require('dotenv').config();
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check } = require('express-validator');
const blogPost = require(path.join(__dirname, '../models/blogPost'));

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
          res.json({ message: 'Log in to create posts' });
        } else {
          const { title, body } = req.body;
          const author = user[0].id;

          blogPost.create(
            {
              author,
              title,
              body,
            },
            function (error, user) {
              if (error) {
                res.json({
                  message: 'Error entering into database, please try again',
                });
              } else {
                res.json({ message: 'Success' });
                // TODO respond that the blog was saved successfully
              }
            }
          );
        }
      }
    )(req, res);
  },
];

exports.updatePost = [
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
          res.json({ message: 'Log in to create posts' });
        } else {
          res.json({ message: 'logged in' });
          // User.findOneAndUpdate(query, update, options, function (error, result) {
          //   if (error) {
          //     done(error);
          //   } else {
          //     done(null, result);
          //   }
          // });
        }
      }
    )(req, res);
  },
];
