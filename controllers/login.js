require('dotenv').config();
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check } = require('express-validator');
const { logger } = require(path.join(__dirname, '../logger/logger'));

// [ LOGIN FOR LOCAL STRATEGY ]
exports.login_local_post = [
  check('username').trim().escape(),
  check('password').trim().escape(),
  function (req, res, next) {
    passport.authenticate(
      'local',
      { session: false },
      function (error, user, info) {
        // error || !user
        if (error || !user) {
          return res.status(400).json({
            message: 'Something is not right',
            user: user,
          });
        }
        // user found
        req.login(user, { session: false }, (err) => {
          if (err) {
            res.send(err);
          }
          const token = jwt.sign(
            {
              data: user.toJSON(),
              exp: Math.floor(Date.now() / 1000) + 60 * 60,
            },
            process.env.JWT_SECRET
          );
          // TODO redirect to home page, send user and token via cookies
          res.cookie('user', user.toJSON());
          res.cookie('token', token);
          res.json({ token });
          // return res.redirect('/');
        });
      }
    )(req, res, next);
  },
];

exports.login_google_get = passport.authenticate('google', {
  session: false,
  scope: ['profile', 'email'],
});

exports.login_google_success_get = function (req, res, next) {
  passport.authenticate('google', function (error, user, info) {
    const { id, username } = user;
    if (error) {
      return next(error);
    }
    // TODO create jwt token

    const token = jwt.sign(
      {
        data: user.toJSON(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      process.env.JWT_SECRET
    );
    // TODO clear cookies that we are setting
    //
    // TODO redirect to home page, send user and token via cookies
    res.cookie('id', id);
    res.cookie('username', username);
    res.cookie('token', token);
    return res.redirect('/');
  })(req, res, next);
};

exports.test = [
  passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    res.end('test');
  },
];
