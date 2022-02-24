require('dotenv').config();
const path = require('path');
const async = require('async');
const passport = require('passport');
const { check } = require('express-validator');
const { logger } = require(path.join(__dirname, '../logger/logger.js'));
const BlogPost = require(path.join(__dirname, '../models/blogPost'));
const User = require(path.join(__dirname, '../models/user'));
const auth = require(path.join(__dirname, '../utils/auth'));

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
          res.status(401).json({ message: 'Unauthorized' });
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
          res.status(401).json({ message: 'Unauthorized' });
        } else {
          BlogPost.findById(req.params.id, function (error, post) {
            if (error) {
              next(error);
            } else if (post.author.toString() !== user.id) {
              res.status(403).json({ message: 'Forbidden' });
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

// [ DELETE BLOG POST ]
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
              res.status(401).json({ message: 'Unauthorized' });
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
              res.status(403).json({ message: 'Forbidden' });
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
          res.status(201).json({ message: 'Post deleted' });
        })
        .catch((error) => next(error));
    }
  );
};

// [ LIKE BLOG POST ]
exports.incrementPostLikes = function (req, res, next) {
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
              res.status(401).json({ message: 'Unauthorized' });
            } else {
              done(null, user);
            }
          }
        )(req, res);
      },
      function (user, done) {
        const blogID = req.params.id;
        if (user.likes.includes(blogID)) {
          res.status(400).json({ message: 'Currently liked' });
        } else {
          done(null, user);
        }
      },
      function (user, done) {
        // increment blogpost
        BlogPost.findOneAndUpdate(
          req.params.id,
          { $inc: { likes: 1 } },
          { upsert: true, new: true },
          function (error, result) {
            if (error) {
              next(error);
            } else {
              done(null, user);
            }
          }
        );
      },
    ],
    function (error, user) {
      // add blogid to user likes
      const query = { _id: user.id };
      const update = { $push: { likes: req.params.id } };
      const options = { upsert: true, new: true };
      User.findOneAndUpdate(query, update, options, function (error, result) {
        if (error) {
          next(error);
        } else {
          res.status(201).json({ message: 'Post has been liked' });
        }
      });
    }
  );
};

// [ UNLIKE BLOG POST ]
exports.decrementPostLikes = [
  function (req, res, next) {
    auth(req, res, next);
  },
  function (req, res, next) {
    if (!req.user.likes.includes(req.params.id)) {
      res.status(400).json({ message: 'Currently not liked' });
    } else {
      next();
    }
  },
  function (req, res, next) {
    res.end();
    //
  },
];
