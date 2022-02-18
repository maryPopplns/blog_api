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
            process.env.JWT_SECRET,
            { algorithm: 'RS256' }
          );
          res.location(process.env.URL);
          return res.json({ user, token });
        });
      }
    )(req, res, next);
  },
];

exports.login_google_get = passport.authenticate('google', {
  scope: ['email'],
});

exports.login_google_success_get = passport.authenticate('google', {
  failureRedirect: '/',
  successRedirect: '/',
  failureMessage: true,
});