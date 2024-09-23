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
    console.log("Users fetched:", users);
    res.json(users);
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
    console.log("User fetched:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
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
    res.json(user);
    res.redirect("/login.html"); // Change this later to EJS file
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
    console.error(err);
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

async function updateUserPasswordById(req, res, next) {
  console.log("updateUserPasswordById called");
  try {
    let userId = req.params.id;
    let password = req.body.Password;

    const params = [password, userId];
    const user = await model.updateUserPasswordById(params);
    console.log("User password updated:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user password" });
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
    res.json(user);
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
    console.log("User fetched:", user);
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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  createNewUser,
  updateUserById,
  updateUserLocationById,
  updateUserPasswordById,
  deleteUserById,
  getUserByEmail,
  getUserType,
};
