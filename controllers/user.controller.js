/**
 * This module contains the controller functions for the user routes by calling the appropriate user model function.
 * @module controllers/user.controller
 * @file This file contains the controller functions for the user routes by calling the appropriate user model function.
 */
"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/user.model");
const shelterModel = require("../models/shelter.model");
const notifsModel = require("../models/notifications.model");
const disasterzoneModel = require("../models/disasterzone.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("../middleware/nodemailer");

/**
 * This function getAllUsers() is used to get all the users from the database by calling the getAll() function from the user.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllUsers(req, res, next) {
  console.log("getAllUsers called");
  try {
    const users = await model.getAll();
    let loggedIn = req.user ? true : false;
    let user_type = null;
    let user_id = null;
    if (req.user) {
      user_type = req.user.userType;
      user_id = req.user.id;
    }
    //console.log("Users fetched:", users);
    console.log("Logged in:", loggedIn);
    console.log("User type:", user_type);
    console.log("User ID:", user_id);

    if (req.accepts("html")) {
      res.render("admin/user-management", {
        users: users,
        loggedIn: loggedIn,
        user_type: user_type,
        user_id: user_id,
      });
    } else {
      res.json(users);
    }

    //res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getUserById() is used to get a user by their ID from the database by calling the getUserById() function from the user.model.js file.
 * @param {*} req The request object containing the paramaters of the user to get from the params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getUserById(req, res, next) {
  console.log("getUserById called");
  try {
    const userId = req.params.id;
    const user = await model.getUserById(userId);
    console.log("User fetched from getUserByID:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
    console.error(err);
    next(err);
  }
}

async function getUserLocationById(req, res, next) {
  console.log("getUserLocationById called");
  try {
    const userId = req.params.id;
    const location = await model.getUserLocationById(userId);
    console.log("Location fetched from getUserLocationById:", location);
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user location" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createUser() is used to create a new user in the database by calling the createUser() function from the user.model.js file.
 * @param {*} req The request object containing the paramaters of the user to create from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createUser(req, res, next) {
  console.log("createUser called");
  try {
    let firstName = req.body.First_Name;
    let lastName = req.body.Last_Name;
    let password = req.body.Password;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let email = req.body.Email;

    const params = [firstName, lastName, password, latitude, longitude, email];
    const user = await model.createUser(params);
    console.log("User created:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createNewUser() is used to create a new user in the database with a hashed password by calling the createNewUser() function from the user.model.js file.
 * @param {*} req The request object containing the paramaters of the user to create from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createNewUser(req, res, next) {
  console.log("createNewUser called");
  try {
    let firstName = req.body.First_Name;
    let lastName = req.body.Last_Name;
    let password = req.body.Password;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let email = req.body.Email;

    const params = [firstName, lastName, password, latitude, longitude, email];
    const user = await model.createNewUser(params);
    console.log("User created:", user);
    if (req.accepts("html")) {
      const referer = req.get("referer");
      if (referer && !referer.includes("/auth/register")) {
        res.redirect(referer);
      } else {
        res.redirect("/auth/login");
      }
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
    console.error(err);
    next(err);
  }
}

/**
 * This function initiatePasswordReset() is used to initiate a password reset for a user by calling the getUserByEmail(), saveResetToken(), and sendEmailFunc() functions from the user.model.js file and the nodemailer.js file
 * @param {*} req The request object containing the email of the user to reset the password for from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function initiatePasswordReset(req, res, next) {
  console.log("initiatePasswordReset called");
  try {
    let email = req.body.Email;
    const user = await model.getUserByEmail(email);
    console.log("User fetched from getUserByEmail:", user);

    if (!user) {
      if (req.accepts("html")) {
        req.flash("error", "No account found with that email address");
        return res.redirect("/auth/forgot-password");
      }
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    const params = [token, expires, user.id];
    await model.saveResetToken(params);

    // Send password reset email
    const resetUrl = `http://localhost:8000/auth/reset-password/${token}`;
    const mailOptions = {
      from: process.env.OAUTH_EMAIL_USER,
      to: user.Email,
      subject: "Password Reset Request",
      text: `Please use the following link to reset your password: ${resetUrl}`,
      html: `<p>Please use the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    };
    await nodemailer.sendEmailFunc(mailOptions);

    console.log("Password reset email sent to:", user.Email);

    if (req.accepts("html")) {
      req.flash(
        "success",
        "Password reset email sent. Please check your inbox."
      );
      return res.redirect("/auth/login");
    }
    return res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Failed to initiate password reset:", err);
    if (req.accepts("html")) {
      req.flash("error", "Failed to process password reset request");
      return res.redirect("/auth/forgot-password");
    }
    return res.status(500).json({ error: "Failed to initiate password reset" });
    next(err);
  }
}

/**
 * This function resetPassword() is used to reset a user's password by calling the getUserByResetToken(), updateUserPasswordById(), and clearResetToken() functions from the user.model.js file
 * @param {*} req The request object containing the token and password of the user to reset the password for from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function resetPassword(req, res, next) {
  console.log("resetPassword called");

  try {
    const token = req.body.token || req.params.token; // Handle both POST and route parameter
    const password = req.body.Password;

    console.log("Reset attempt with token:", token);

    if (!token || !password) {
      console.log("Missing token or password");
      if (req.accepts("html")) {
        req.flash("error", "Invalid password reset request");
        return res.redirect("/auth/login");
      }
      return res.status(400).json({ error: "Token and password are required" });
    }

    const user = await model.getUserByResetToken(token);
    console.log("User fetched from getUserByResetToken:", user);

    if (!user) {
      console.log("No user found with valid reset token");
      if (req.accepts("html")) {
        req.flash("error", "Invalid or expired password reset token");
        return res.redirect("/auth/login");
      }
      return res.status(404).json({ error: "Invalid or expired reset token" });
    }

    // Add logging for password update attempt
    console.log("Attempting to update password for user:", user.id);

    // Update password and clear reset token
    await model.updateUserPasswordById([password, user.id]);
    await model.clearResetToken(user.id);

    console.log("Password successfully reset for user:", user.id);

    if (req.accepts("html")) {
      req.flash(
        "success",
        "Password successfully reset. Please login with your new password."
      );
      return res.redirect("/auth/login");
    }
    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Failed to reset password:", err);
    if (req.accepts("html")) {
      req.flash("error", "Failed to reset password");
      return res.redirect("/auth/login");
    }
    return res.status(500).json({ error: "Failed to reset password" });
    next(err);
  }
}

/**
 * This function updateUserById() is used to update a user by their ID in the database by calling the updateUserById() function from the user.model.js file
 * @param {*} req The request object containing the parameters of the user to update from req.body & req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateUserById(req, res, next) {
  console.log("updateUserById called");
  try {
    let userId = req.params.id;
    let firstName = req.body.First_Name;
    let lastName = req.body.Last_Name;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let email = req.body.Email;

    const userTemp = await model.getUserById(userId);
    if (!firstName) {
      firstName = userTemp.First_Name;
    }

    if (!lastName) {
      lastName = userTemp.Last_Name;
    }

    if (!latitude) {
      latitude = userTemp.Latitude;
    }

    if (!longitude) {
      longitude = userTemp.Longitude;
    }

    if (!email) {
      email = userTemp.Email;
    }

    const params = [firstName, lastName, latitude, longitude, email, userId];
    const user = await model.updateUserById(params);
    console.log("User updated:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateUserLocationById() is used to update a user's location by their ID in the database by calling the updateUserLocationById() function from the user.model.js file
 * @param {*} req The request object containing the parameters of the user to update from req.body & req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateUserLocationById(req, res, next) {
  console.log("updateUserLocationById called");
  try {
    let userId = req.params.id;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;

    const params = [latitude, longitude, userId];
    const user = await model.updateUserLocationById(params);
    console.log("User location updated:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user location" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateUserPasswordById() is used to update a user's password by their ID in the database by calling the updateUserPasswordById() function from the user.model.js file
 * @param {*} req The request object containing the parameters of the user to update from req.body & req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateUserPasswordById(req, res, next) {
  console.log("updateUserPasswordById called");
  try {
    let userId = req.params.id;
    let currentPassword = req.body.password;
    let newPassword = req.body.new_password;

    // Log the inputs to debug
    console.log("User ID:", userId);

    // Fetch the user from the database
    const user = await model.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the user object to debug
    console.log("User fetched from DB:", user);

    // Verify the provided current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.Password
    ); // Use the correct case
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Call the model function to update the password
    const params = [newPassword, userId];
    const updatedUser = await model.updateUserPasswordById(params);
    if (req.accepts("html")) {
      res.redirect("/auth/login");
    } else {
      res.json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update user password" });
    console.error(err);
    next(err);
  }
}

/**
 * This function initiateEmailChange() sends an email to verify the correct user in a similar manner to initiatePasswordChange()
 * @param {*} req The request object containing the email of the user to reset the email for from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function initiateEmailChange(req, res, next) {
  console.log("initiateEmailChange called");
  try {
    let email = req.body.Email;
    const user = await model.getUserByEmail(email);
    console.log("User fetched from getUserByEmail:", user);

    if (!user) {
      if (req.accepts("html")) {
        req.flash("error", "No account found with that email address");
        return res.redirect("/auth/forgot-password");
      }
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    const params = [token, expires, user.id];
    await model.saveResetToken(params);

    // Send email change email
    const resetUrl = `http://localhost:8000/auth/new-email/${token}`;
    const mailOptions = {
      from: process.env.OAUTH_EMAIL_USER,
      to: user.Email,
      subject: "Change Email Request",
      text: `Please use the following link to change your email: ${resetUrl}`,
      html: `<p>Please use the following link to change your email:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    };
    await nodemailer.sendEmailFunc(mailOptions);

    console.log("Change email message sent to:", user.Email);

    if (req.accepts("html")) {
      req.flash(
        "success",
        "Change email message sent. Please check your inbox."
      );
      return res.redirect("/auth/login");
    }
    return res.status(200).json({ message: "Change email message sent" });
  } catch (err) {
    console.error("Failed to initiate email change:", err);
    if (req.accepts("html")) {
      req.flash("error", "Failed to process change email request");
      return res.redirect("/auth/forgot-password");
    }
    return res.status(500).json({ error: "Failed to initiate email change" });
    next(err);
  }
}

/**
 * This function updateUserEmailById() is used to update a user's email by their ID in the database by calling the updateUserEmailById() function from the user.model.js file
 * @param {*} req The request object containing the parameters of the user to update from req.body & req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateUserEmailById(req, res, next) {
  console.log("updateUserEmailById called");
  try {
    let userId = req.params.id;
    let currentEmail = req.body.old_email;
    let newEmail = req.body.new_email;
    let password = req.body.password;

    // Log the inputs to debug
    console.log("User ID:", userId);
    console.log("Current Email:", currentEmail);
    console.log("New Email:", newEmail);

    // Fetch the user from the database
    const user = await model.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the user object to debug
    console.log("User fetched from DB:", user);

    // Verify the provided password
    const isPasswordCorrect = await bcrypt.compare(password, user.Password); // Use the correct case
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Proceed to update the email address
    const params = [newEmail, userId];
    const updatedUser = await model.updateUserEmailById(params);
    if (req.accepts("html")) {
      const referer = req.get("referer");
      if (referer) {
        res.redirect(referer);
      } else {
        res.redirect("/auth/login");
      }
    } else {
      res.json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update user email" });
    console.error(err);
    next(err);
  }
}

/**
 * This function deleteUserById() is used to delete a user by their ID in the database by calling the deleteUserById() function from the user.model.js file
 * @param {*} req The request object containing the params of the user to delete from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function deleteUserById(req, res, next) {
  console.log("deleteUserById called");
  try {
    const userId = req.params.id;
    const user = await model.deleteUserById(userId);
    console.log("User deleted:", user);

    //
    if (req.accepts("html")) {
      const referer = req.get("referer");
      if (referer) {
        res.redirect(referer);
      } else {
        res.redirect("/");
      }
    } else {
      res.json(user);
    }

    //res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getUserByEmail() is used to get a user by their email from the database by calling the getUserByEmail() function from the user.model.js file
 * @param {*} req The request object containing the email of the user to get from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getUserByEmail(req, res, next) {
  console.log("getUserByEmail called");
  try {
    let email = req.params.email;
    const user = await model.getUserByEmail(email);
    console.log("User fetched from getUserByEmail:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getUserType() is used to get the user type of a user by their ID from the database by calling the getUserType() function from the user.model.js file
 * @param {*} req The request object containing the ID of the user to get from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getUserType(req, res, next) {
  console.log("getUserType called");
  try {
    let id = req.params.id;
    const user = await model.getUserType(id);
    console.log("User type fetched:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user type" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAdminDashboard() is used to render the admin dashboard by calling the render() function
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAdminDashboard(req, res, next) {
  console.log("getAdminDashboard called");
  try {
    let loggedIn = req.user ? true : false;
    let user_type = null;
    let user_id = null;
    if (req.user) {
      user_type = req.user.userType;
      user_id = req.user.id;
    }
    console.log("Logged in:", loggedIn);
    console.log("User type:", user_type);
    console.log("User ID:", user_id);

    if (req.accepts("html")) {
      res.render("admin/admin-dash", {
        loggedIn: loggedIn,
        user_type: user_type,
        user_id: user_id,
      });
    } else {
      res.json("dashboard");
    }

    //res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to render admin dash" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAdminShelters() is used to render the admin shelters page and calls the getAllSheltersAndDisasterZones() function from the shelter.model.js file
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAdminShelters(req, res, next) {
  console.log("getAdminShelters called");
  try {
    const shelters = await shelterModel.getAllSheltersAndDisasterZones();
    //console.log("Shelters fetched:", shelters);
    let loggedIn = req.user ? true : false;
    let user_type = null;
    let user_id = null;
    if (req.user) {
      user_type = req.user.userType;
      user_id = req.user.id;
    }
    console.log("Logged in:", loggedIn);
    console.log("User type:", user_type);
    console.log("User ID:", user_id);

    if (req.accepts("html")) {
      res.render("shelters/admin_shelters", {
        shelters: shelters,
        loggedIn: loggedIn,
        user_type: user_type,
        user_id: user_id,
      });
    } else {
      res.json(shelters);
    }

    //res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to render admin shelters" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getUserResources() is used to render the user resource page
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getUserResources(req, res, next) {
  console.log("getUserResources called");
  try {
    let loggedIn = req.user ? true : false;
    let user_type = null;
    let user_id = null;
    if (req.user) {
      user_type = req.user.userType;
      user_id = req.user.id;
    }
    console.log("Logged in:", loggedIn);
    console.log("User type:", user_type);
    console.log("User ID:", user_id);

    if (req.accepts("html")) {
      res.render("user/user_resource", {
        loggedIn: loggedIn,
        user_type: user_type,
        user_id: user_id,
      });
    } else {
      res.json("PAGE");
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to render user resource" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAdminAlertPage() is used to render the admin alert page
 * @param {*} req The request
 * @param {*} res The response
 * @param {*} next The next middleware function
 */
async function getAdminAlertPage(req, res, next) {
  const notifs = await notifsModel.getAllNotifsWithDisasterZone();
  const disasterzones = await disasterzoneModel.getAll();
  console.log("getAdminAlertPage called");
  try {
    let loggedIn = req.user ? true : false;
    let user_type = null;
    let user_id = null;
    if (req.user) {
      user_type = req.user.userType;
      user_id = req.user.id;
    }
    console.log("Logged in:", loggedIn);
    console.log("User type:", user_type);
    console.log("User ID:", user_id);

    res.render("admin/admin-alert", {
      notifs: notifs,
      disasterzones: disasterzones,
      loggedIn: loggedIn,
      user_type: user_type,
      user_id: user_id,
      title: "Admin Alert",
      message: req.flash("error")[0],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to render admin alert" });
    console.error(err);
    next(err);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserLocationById,
  createUser,
  createNewUser,
  updateUserById,
  updateUserLocationById,
  updateUserPasswordById,
  deleteUserById,
  getUserByEmail,
  getUserType,
  initiatePasswordReset,
  resetPassword,
  getAdminDashboard,
  getAdminShelters,
  getUserResources,
  getAdminAlertPage,
  initiateEmailChange,
  updateUserEmailById,
};
