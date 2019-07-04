const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // Checks if user with that googleId already exist in db
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          // When we already have a cord with the given profile Id
          done(null, existingUser);
        } else {
          // When we don't have a record with this Id. Make a new recortd!
          new User({ googleId: profile.id })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
