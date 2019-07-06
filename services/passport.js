const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

const User = mongoose.model("users");

// Turns user model instance into id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Turns id into user model instance
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
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
