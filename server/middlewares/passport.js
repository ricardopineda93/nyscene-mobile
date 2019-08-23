const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../database/index');
const express = require('express');

passport.use(
  new LocalStrategy(async function(email, password, done) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.correctPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  })
);

const passportMiddleware = express();
passportMiddleware.use(passport.initialize());
passportMiddleware.use(passport.session());

module.exports = {
  passportMiddleware
};
