/**
 * This file contains the routes for the authentication of users.
 * @module auth/auth.route
 * @file This file contains the routes for the authentication of users.
 */
"use strict";
const express = require("express");
const router = express.Router();
const passport = require("./auth.passport");

/* This is basically a route to the login page but it doesn't work YET
router.get("/login", function (req, res) {
  res.render("user/login", { title: "Login", message: req.flash("error")[0] });
});
*/

/* THIS IS EXPERIMENTAL CODE THAT WILL BE DELETED LATER
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ status: 'error', code: 'unauthorized' });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            //return res.status(200).json({ status: 'success', code: 'authorized' });
            return res.redirect('/');
        });
    })(req, res, next);
});
*/

/**
 * This is the login route that will be used to authenticate users.
 * This is a POST request.
 */
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", info.message);
      //return res.redirect("/auth/login");
      return res.json({ status: "error", code: "unauthorized" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
      //return res.json({ status: "success", code: "authorized" });
    });
  })(req, res, next);
});

/**
 * This is the logout route that will be used to log users out while redirecting them to the home page.
 * Although, it doesn't redirect as of now.
 * This is a GET request.
 */
router.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: "error", code: "server error" });
    }
    //return res.redirect("/");
    return res.status(200).json({ status: "success", code: "logged out" });
  });
});

/**
 * This is the logout route that will be used to log users out.
 * This is a POST request.
 */
router.post("/logout", function (req, res) {
  if (!req.user) {
    return res.json({ status: "error", code: "unauthorized" });
  }

  req.logout(function (err) {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", code: "server error", message: err.message });
    }

    // Check if the user is still in the session to confirm they have been logged out
    if (req.user) {
      return res.status(400).json({ status: "error", code: "server error" });
    }

    return res.status(200).json({ status: "success", code: "logged out" });
  });
});

/**
 * This is the status route that will be used to check if a user is logged in.
 * This is a GET request.
 */
router.get("/status", function (req, res) {
  console.log("User:", req.user);
  console.log("Session:", req.session);

  if (req.user) {
    res.json({ status: "User is logged in", user: req.user });
  } else {
    res.json({ status: "User is not logged in" });
  }
});

module.exports = router;
