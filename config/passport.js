require('dotenv').config();
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const e = require('express');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { logger } = require(path.join(__dirname, '../logger/logger'));

const User = require(path.join(__dirname, '../models/user'));

// [ DEFINE LOCAL STRATEGY ]
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (error, user) => {
      if (error) {
        return done(error);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (error, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/google/success',
    },
    function (accessToken, refreshToken, profile, done) {
      const { email } = profile._json;

      const query = { username: email };
      const update = { username: email };
      const options = { upsert: true, new: true };
      // Find the document
      User.findOneAndUpdate(query, update, options, function (error, result) {
        if (error) {
          done(error);
        } else {
          done(null, result);
        }
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, done) {
      console.log(`${jwtPayload}`);
      User.find({ id: jwtPayload.id })
        .then((user) => {
          if (!user) {
            done(null, false);
          } else {
            done(null, user);
          }
        })
        .catch((error) => done(error));
    }
  )
);
