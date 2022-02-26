require('dotenv').config();
const path = require('path');
const async = require('async');
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
      .catch(next);
  },
  function (req, res, next) {
    // delete post
    BlogPost.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(201).json({ message: 'Post deleted' });
      })
      .catch(next);
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
          // update blog
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
          // update user
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
  authentication,
  function (req, res, next) {
    if (!req.user.likes.includes(req.params.id)) {
      res.status(400).json({ message: 'Currently not liked' });
    } else {
      next();
    }
  },
  function (req, res, next) {
    async.parallel(
      {
        blogLikes: function (done) {
          // update blog
          BlogPost.findByIdAndUpdate(
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
          // update user
          User.findByIdAndUpdate(
            req.user.id,
            { $pullAll: { likes: [{ _id: req.params.id }] } },
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
        res.status(201).json({ message: 'Post has been unliked' });
      }
    );
  },
];

// [ POST COMMENT ]
exports.commentPost = [
  check('comment').trim().escape(),
  authentication,
  function (req, res, next) {
    const updateContent = {
      author: req.user.id,
      comment: req.body.comment,
    };
    // post comment
    BlogPost.findById(req.params.id)
      .then((post) => {
        post.comments.push(updateContent);
        post
          .save()
          .then(() => {
            res.status(201).json({ message: 'Comment saved' });
          })
          .catch(next);
      })
      .catch(next);
  },
];

// [ DELETE COMMENT ]
exports.commentDelete = [
  authentication,
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
      .catch(next);
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
          .catch(next);
      })
      .catch(next);
  },
];
