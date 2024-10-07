/**
 * This file contains the routes for the authentication of users.
 * @module auth/auth.route
 * @file This file contains the routes for the authentication of users.
 */
"use strict";
const express = require("express");
const router = express.Router();
const passport = require("./auth.passport");
const userModel = require("../models/user.model");
const userController = require("../controllers/user.controller");

/**
 * This is the login route that'll be used to render the login page.
 */
router.get("/login", function (req, res) {
  res.render("user/login", { title: "Login", message: req.flash("error")[0] });
});

/**
 * This is the register route that'll be used to render the register page.
 */
router.get("/register", function (req, res) {
  res.render("user/signup", {
    title: "Sign Up",
  });
});

/**
 * This is the register route that'll be used to render the register page.
 */
router.get("/forgot-password", function (req, res) {
  res.render("user/find_by_email", {
    title: "Forgot Password",
  });
});

/**
 * This is the forgot password route that'll be used to handle the forgot password request.
 */
router.post("/forgot-password-email", userController.initiatePasswordReset);

/**
 * This'll be for the reset password page.
 */
router.get("/reset-password/:token", function (req, res) {
  res.render("user/forgot_pw", {
    title: "Reset Password",
    token: req.params.token,
  });
});

/**
 * This'll handle the reset password request.
 */
router.post("/resetting-password", userController.resetPassword);

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
      console.log("Login Error:", err);
      return res
        .status(500)
        .json({ success: false, status: "error", code: "server_error" });
    }
    if (!user) {
      if (req.accepts("html")) {
        req.flash("error", info.message);
        return res.redirect("/auth/login");
      } else {
        return res
          .status(401)
          .json({ success: false, status: "error", code: "unauthorized" });
      }
    }
    req.logIn(user, function (err) {
      if (err) {
        console.error("Login error:", err);
        return res
          .status(500)
          .json({ success: false, status: "error", code: "server_error" });
      }

      console.log("Login successful");
      if (req.accepts("html")) {
        return res.redirect("/");
      } else {
        return res.json({
          success: true,
          status: "success",
          code: "authorized",
        });
      }
    });
  })(req, res, next);
});

/**
 * This is the logout route that will be used to log users out while redirecting them to the home page.
 * Although, it doesn't redirect as of now.
 * This is a GET request.
 */
router.get("/logout", function (req, res) {
  if (!req.user) {
    return res.status(401).json({ status: "error", code: "unauthorized" });
  }

  req.logout(function (err) {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", code: "server error", message: err.message });
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error("Session destruction error:", sessionErr);
        return res.status(500).json({
          status: "error",
          code: "server_error",
          message: "An error occurred while clearing the session",
        });
      }
    });

    res.clearCookie("connect.sid", { path: "/" });

    if (req.accepts("html")) {
      console.log("Redirecting to login page");
      return res.redirect("/auth/login");
    } else {
      return res.status(200).json({ status: "success", code: "logged out" });
    }
  });
});

/**
 * This is the logout route that will be used to log users out.
 * This is a POST request.
 */
router.post("/logout", function (req, res) {
  if (!req.user) {
    return res.status(401).json({ status: "error", code: "unauthorized" });
  }

  req.logout(function (err) {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", code: "server error", message: err.message });
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error("Session destruction error:", sessionErr);
        return res.status(500).json({
          status: "error",
          code: "server_error",
          message: "An error occurred while clearing the session",
        });
      }
    });

    res.clearCookie("connect.sid", { path: "/" });

    if (req.accepts("html")) {
      return res.redirect("/login.html");
    } else {
      return res.status(200).json({ status: "success", code: "logged out" });
    }
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
