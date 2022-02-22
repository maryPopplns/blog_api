require('dotenv').config();
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check } = require('express-validator');
const BlogPost = require(path.join(__dirname, '../models/blogPost'));

// [ CREATE BLOG POST ]
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
          // not logged in
          res.json({ message: 'Log in to create posts' });
        } else {
          const { title, body } = req.body;
          const author = user._id;

          // logged in
          BlogPost.create(
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
              }
            }
          );
        }
      }
    )(req, res);
  },
];

// [ UPDATE BLOG POST ]
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
          // not logged in
          res.json({ message: 'Log in to create posts' });
        } else {
          const userID = user._id;
          BlogPost.findById(req.params.id, function (error, post) {
            if (error) {
              next(error);
            } else if (post.author.toString() !== userID) {
              // if user !== post author
              res.json({ message: 'Unauthorized' });
            } else {
              const { title, body } = req.body;
              const query = post.id;
              const update = { title, body };
              const options = { upsert: true, new: true };
              // if user === post author, update the post
              BlogPost.findByIdAndUpdate(
                query,
                update,
                options,
                function (error, result) {
                  if (error) {
                    res.json({
                      message: 'Error entering into database, please try again',
                      error: error,
                    });
                  } else {
                    res.json({ message: 'success' });
                  }
                }
              );
            }
          });
        }
      }
    )(req, res);
  },
];

exports.deletePost = function (req, res, next) {
  //
};
