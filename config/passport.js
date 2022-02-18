const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require(path.join(__dirname, '../models/user'));
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// [ LOCAL STRATEGY ]
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    });
  })
);

// create user
// use postman to test
