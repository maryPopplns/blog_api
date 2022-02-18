const path = require('path');
const passport = require('passport');
const express = require('express');
const router = express.Router();

const { logger } = require(path.join(__dirname, '../logger/logger.js'));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.end('newOne1');
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
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

      const token = jwt.sign(user, 'your_jwt_secret');
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;
