const path = require('path');
const passport = require('passport');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { check } = require('express-validator');
const { logger } = require(path.join(__dirname, '../logger/logger.js'));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.end('newOne1');
});

router.post('/login', [
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
]);

module.exports = router;
