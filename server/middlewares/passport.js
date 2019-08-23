const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../database/index');
const express = require('express');

// Middleware for passport local strategy

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async function(username, password, done) {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.correctPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }
  )
);

const passportMiddleware = express();
passportMiddleware.use(passport.initialize());
passportMiddleware.use(passport.session());

module.exports = {
  passportMiddleware
};
