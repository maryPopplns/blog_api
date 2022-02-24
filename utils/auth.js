const passport = require('passport');

module.exports = function (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (error, user) {
    if (error) {
      next(error);
    } else if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      req.user = user;
      next();
    }
  })(req, res);
};
