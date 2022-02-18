require('dotenv').config();
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
          const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
          res.location(process.env.URL);
          return res.json({ user, token });
        });
      }
    )(req, res, next);
  },
];
