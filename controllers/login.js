const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check } = require('express-validator');
const { logger } = require(path.join(__dirname, '../logger/logger.js'));

// [ LOGIN FOR LOCAL STRATEGY ]
exports.login_local_post = [
  check('username').trim().escape(),
  check('password').trim().escape(),
  function (req, res, next) {
    passport.authenticate(
      'local',
      { session: false },
      function (error, user, info) {
        if (error || !user) {
          return res.status(400).json({
            message: 'Something is not right',
            user: user,
          });
        }
        req.login(user, { session: false }, (err) => {
          if (err) {
            res.send(err);
          }
          // generate a signed son web token with the contents of user object and return it in the response
          const token = jwt.sign(user.toJSON(), 'your_jwt_secret');
          return res.json({ user, token });
        });
      }
    )(req, res, next);
  },
];
