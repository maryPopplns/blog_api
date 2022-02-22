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
          let currentBlogPost;
          // TODO search blogposts using blogID
          // TODO populate the author for the blogpost
          BlogPost.findById(req.params.id)
            .then((result) => {
              currentBlogPost = result;
            })
            .catch((error) => next(error));
          console.log(currentBlogPost);
          res.end();

          // BlogPost.findOneAndUpdate(
          // const query = { username: email };
          // const update = { username: email };
          // const options = { upsert: true, new: true };
          //   query,
          //   update,
          //   options,
          //   function (error, result) {
          //     if (error) {
          //       done(error);
          //     } else {
          //       done(null, result);
          //     }
          //   }
          // );
        }
      }
    )(req, res);
  },
];
