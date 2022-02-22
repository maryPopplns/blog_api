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
          res.json({ message: 'Log in to create posts' });
        } else {
          const { title, body } = req.body;
          const author = user[0].id;

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
          res.json({ message: 'Log in to create posts' });
        } else {
          const userID = user[0].id;
          let updateBlogPost;
          // TODO search blogposts using blogID
          // TODO populate the author for the blogpost
          BlogPost.findById(req.params.id, function (error, post) {
            if (error) {
              next(error);
            } else if (post.author.toString() !== userID) {
              res.status(401).json({ message: 'Unauthorized' });
            } else {
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
