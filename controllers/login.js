const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check } = require('express-validator');
const { logger } = require(path.join(__dirname, '../logger/logger.js'));

exports.login_local = [
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
        } else {
          res.json({ user });
        }

        // if (error) {
        //   return next(error);
        // } else if (!user) {
        //   return res.render('login', { message: info.message });
        // } else {
        //   req.logIn(user, function (err) {
        //     if (error) {
        //       return next(err);
        //     } else {
        //       return res.redirect('/');
        //     }
        //   });
        // }
      }
    )(req, res, next);
  },
];
