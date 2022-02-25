require('dotenv').config();
const path = require('path');
const async = require('async');
const passport = require('passport');
const { check } = require('express-validator');
const { logger } = require(path.join(__dirname, '../logger/logger.js'));
const BlogPost = require(path.join(__dirname, '../models/blogPost'));
const User = require(path.join(__dirname, '../models/user'));
const authentication = require(path.join(__dirname, '../utils/auth'));

// [ CREATE BLOG POST ]
exports.createPost = [
  check('title').trim().escape(),
  check('body').trim().escape(),
  authentication,
  function (req, res, next) {
    const { title, body } = req.body;
    const author = req.user.id;
    BlogPost.create(
      {
        author,
        title,
        body,
      },
      function (error) {
        if (error) {
          next(error);
        } else {
          res.status(201).json({ message: 'Post created' });
        }
      }
    );
  },
];

// [ UPDATE BLOG POST ]
exports.updatePost = [
  check('title').trim().escape(),
  check('body').trim().escape(),
  authentication,
  function (req, res, next) {
    // authorization
    BlogPost.findById(req.params.id, function (error, post) {
      if (error) {
        next(error);
      } else if (post.author.toString() !== req.user.id) {
        res.status(403).json({ message: 'Forbidden' });
      } else {
        next();
      }
    });
  },
  function (req, res, next) {
    // update post
    const { title, body } = req.body;
    BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { upsert: true, new: true },
      function (error) {
        if (error) {
          next(error);
        } else {
          res.status(201).json({ message: 'Post updated' });
        }
      }
    );
  },
];

// [ DELETE BLOG POST ]
exports.deletePost = [
  authentication,
  function (req, res, next) {
    // authorization
    BlogPost.findById(req.params.id)
      .then((blogPost) => {
        if (req.user.id !== blogPost.author.toString()) {
          res.status(403).json({ message: 'Forbidden' });
        } else {
          next();
        }
      })
      .catch((error) => {
        next(error);
      });
  },
  function (req, res, next) {
    // delete post
    BlogPost.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(201).json({ message: 'Post deleted' });
      })
      .catch((error) => next(error));
  },
];

// [ LIKE BLOG POST ]
exports.incrementPostLikes = [
  authentication,
  function (req, res, next) {
    const userLikes = req.user.likes;
    const selectedBlog = req.params.id;
    if (userLikes.includes(selectedBlog)) {
      res.status(400).json({ message: 'Currently liked' });
    } else {
      next();
    }
  },
  function (req, res, next) {
    async.parallel(
      {
        blogLikes: function (done) {
          BlogPost.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { upsert: true, new: true },
            function (error) {
              if (error) {
                next(error);
              } else {
                done(null);
              }
            }
          );
        },
        userLikes: function (done) {
          User.findByIdAndUpdate(
            req.user.id,
            { $push: { likes: req.params.id } },
            { upsert: true, new: true },
            function (error) {
              if (error) {
                next(error);
              } else {
                done(null);
              }
            }
          );
        },
      },
      function () {
        res.status(201).json({ message: 'Post has been liked' });
      }
    );
  },
];

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
    // update user / blogpost
    async.parallel(
      {
        blogLikes: function (done) {
          BlogPost.findOneAndUpdate(
            req.params.id,
            { $inc: { likes: -1 } },
            { upsert: true, new: true },
            function (error) {
              if (error) {
                next(error);
              } else {
                done(null);
              }
            }
          );
        },
        userLikes: function (done) {
          const query = { _id: req.user.id };
          const update = { $pullAll: { likes: [{ _id: req.params.id }] } };
          const options = { upsert: true, new: true };
          User.findOneAndUpdate(query, update, options, function (error) {
            if (error) {
              next(error);
            } else {
              done(null);
            }
          });
        },
      },
      function () {
        res.status(201).json({ message: 'Post has been unliked' });
      }
    );
  },
];

// [ POST COMMENT ]

exports.commentPost = [
  check('comment').trim().escape(),
  function (req, res, next) {
    auth(req, res, next);
  },
  function (req, res, next) {
    const updateContent = {
      author: req.user.id,
      comment: req.body.comment,
    };
    BlogPost.findById(req.params.id)
      .then((post) => {
        post.comments.push(updateContent);
        post
          .save()
          .then(() => {
            res.status(201).json({ message: 'Comment saved' });
          })
          .catch((error) => next(error));
      })
      .catch((error) => next(error));
  },
];

// [ DELETE COMMENT ]
exports.commentDelete = [
  function (req, res, next) {
    auth(req, res, next);
  },
  function (req, res, next) {
    // authorization
    BlogPost.findById(req.params.id)
      .lean()
      .then((post) => {
        const comment = post.comments.filter(
          (comment) => comment._id.toString() === req.params.comment
        )[0];

        if (req.user.id !== comment.author.toString()) {
          res.status(403).json({ message: 'Forbidden' });
        } else {
          next();
        }
      })
      .catch((error) => next(error));
  },
  function (req, res, next) {
    // delete comment
    BlogPost.findById(req.params.id)
      .then((post) => {
        post.comments.id(req.params.comment).remove();
        post
          .save()
          .then(() => {
            res.json({ message: 'Comment deleted' });
          })
          .catch((error) => next(error));
      })
      .catch((error) => next(error));
  },
];
