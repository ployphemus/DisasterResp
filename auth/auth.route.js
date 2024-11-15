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
 * This route defines the path to the account settings page.
 * Users will be able to modify their emails and passwords from here.
 */
router.get("/user-account", function (req, res) {
  const loggedIn = req.user ? true : false;
  let user_type = null;
  let user_id = null;
  let user_email = null;
  if (req.user) {
    user_type = req.user.userType;
    user_id = req.user.id;
    user_email = req.user.Email;
  }
  console.log("Logged in:", loggedIn);
  console.log("User type:", user_type);
  console.log("User ID:", user_id);
  console.log("User Email:", user_email); // Add this line to debug

  // if loggedIn = true, render user account page else go to login page
  if (loggedIn) {
    res.render("user/user_account", {
      loggedIn: loggedIn,
      user_type: user_type,
      user_id: user_id,
      user_email: user_email,
      title: "User Account",
      message: req.flash("error")[0],
    });
  } else {
    res.redirect("/auth/login");
  }
});

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

/**
 * This'll handle the change email request.
 */
router.post("/change-email/:id", userController.updateUserEmailById);

/**
 * This'll handle the change password request.
 */
router.post("/change-password/:id", userController.updateUserPasswordById);

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
  console.log("Login request received from:", req.ip);
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
