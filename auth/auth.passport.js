/**
 * This file contains the passport configuration for the application to authenticate users.
 * @module auth/auth.passport
 * @file This file contains the passport configuration for the application to authenticate users.
 */
"use strict";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

/* THIS CAN STAY BUT IS OLD CODE THAT WILL BE DELETED LATER ON IF NOT NEEDED
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async function (email, password, done) {
    try {
        const user = await User.getOneByEmail(email);
        if (!user) {
            return done(null, false, { message: 'No user found.' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
*/

/**
 * This makes the passport use the LocalStrategy to authenticate the user based on their email and password
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "Email",
      passwordField: "Password",
    },
    /**
     * This function authenticates the user based on their email and password
     * @param {*} email The email of the user
     * @param {*} password The password of the user
     * @param {*} done The callback function
     * @returns {*} Returns the user if authenticated, otherwise returns an error
     */
    async function (email, password, done) {
      try {
        const user = await User.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "No user found." });
        }
        bcrypt.compare(password, user.Password, function (err, isMatch) {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

/**
 * This makes the passport serialize the user.
 * Serializing means converting the user object into an ID.
 */
passport.serializeUser(function (user, done) {
  console.log("Serializing user:", user);
  done(null, user.id);
});

/**
 * This makes the passport deserialize the user.
 * Deserializing means converting the ID into a user object.
 */
passport.deserializeUser(async function (id, done) {
  console.log("Deserializing user:", id);
  try {
    const user = await User.getUserById(id);
    //console.log("User fetched from deserializeUser:", user);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err, null);
  }
});

module.exports = passport;
