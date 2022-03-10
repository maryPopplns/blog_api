require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check } = require('express-validator');

const time = {
  hour: Math.floor(Date.now() / 1000) + 60 * 60,
  day: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
};

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
        if (error) {
          next(error);
        }
        if (!user) {
          return res.status(400).json({
            message: info.message,
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
              exp: time.hour,
            },
            process.env.JWT_SECRET
          );
          // send token / redirect to home
          res.json({ token });
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
  passport.authenticate(
    'google',
    { session: false },
    function (error, user, info) {
      // error
      if (error) {
        next(error);
      }
      if (!user) {
        return res.status(400).json({
          message: info.message,
        });
      }
      const token = jwt.sign(
        {
          data: user.toJSON(),
          exp: time.hour,
        },
        process.env.JWT_SECRET
      );
      // send token / redirect to home
      res.cookie('knightBlogToken', token);
      return res.redirect(process.env.REDIRECT);
    }
  )(req, res, next);
};
