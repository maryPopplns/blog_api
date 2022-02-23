require('dotenv').config();
const path = require('path');
const async = require('async');
const passport = require('passport');
const { check } = require('express-validator');
const { logger } = require(path.join(__dirname, '../logger/logger.js'));
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
          res.status(401).json({ message: 'unauthorized' });
        } else {
          const { title, body } = req.body;
          const author = user.id;
          // logged in
          BlogPost.create(
            {
              author,
              title,
              body,
            },
            function (error, user) {
              if (error) {
                next(error);
              } else {
                res.status(201).json({ message: 'Post created' });
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
          res.status(401).json({ message: 'unauthorized' });
        } else {
          BlogPost.findById(req.params.id, function (error, post) {
            if (error) {
              next(error);
            } else if (post.author.toString() !== user.id) {
              res.status(403).json({ message: 'forbidden' });
            } else {
              // logged in
              const { title, body } = req.body;
              const query = post.id;
              const update = { title, body };
              const options = { upsert: true, new: true };
              BlogPost.findByIdAndUpdate(
                query,
                update,
                options,
                function (error, result) {
                  if (error) {
                    next(error);
                  } else {
                    res.status(201).json({ message: 'Post updated' });
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
  async.waterfall(
    [
      function (done) {
        passport.authenticate(
          'jwt',
          { session: false },
          function (error, user) {
            if (error) {
              next(error);
            } else if (!user) {
              res.status(401).json({ message: 'unauthorized' });
            } else {
              done(null, user);
            }
          }
        )(req, res);
      },
      function (user, done) {
        BlogPost.findById(req.params.id)
          .then((blogPost) => {
            if (user.id !== blogPost.author.toString()) {
              res.status(403).json({ message: 'forbidden' });
            } else {
              done(null);
            }
          })
          .catch((error) => {
            next(error);
          });
      },
    ],
    function () {
      // logged in
      BlogPost.findByIdAndDelete(req.params.id)
        .then(() => {
          res.status(201).json({ message: 'post deleted' });
        })
        .catch((error) => next(error));
    }
  );
};
