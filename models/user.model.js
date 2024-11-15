/**
 * This module contains functions for interacting with the users table in the database.
 * @module models/user.model
 * @file This file contains functions for interacting with the users table in the database.
 */
"use strict";
const db = require("./database");
const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * This function getAll() fetches all users from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all users in the database
 */
async function getAll() {
  const sql = "SELECT * FROM users";
  try {
    const users = await db.all(sql);
    return users;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
}

/**
 * This function getUserBYId() fetches a user by their ID from the database.
 * @param {*} id The ID of the user to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the user with the given ID
 */
async function getUserById(id) {
  const sql = "SELECT * FROM users WHERE id = ?";
  try {
    //console.log("Executing query:", sql, "with ID:", id);
    const user = await db.get(sql, [id]);
    //console.log("User fetched from getUserById:", user);
    return user;
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    throw err;
  }
}

async function getUserLocationById(id) {
  const sql = "SELECT Latitude, Longitude FROM users WHERE id = ?";
  try {
    const location = await db.get(sql, [id]);
    return location;
  } catch (err) {
    console.error("Error fetching user location by ID:", err);
    throw err;
  }
}

/**
 * This function createUser() creates a new user in the database but without hashing the password.
 * @param {*} params The parameters of the user to create
 * @returns {Promise<Object>} Returns a promise that resolves to the user that was created
 */
async function createUser(params) {
  const sql =
    "INSERT INTO users (First_Name, Last_Name, Password, Latitude, Longitude, Email) VALUES (?, ?, ?, ?, ?, ?);";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}

/**
 * This function createNewUser() creates a new user in the database with a hashed password.
 * @param {*} params The parameters of the user to create
 */
async function createNewUser(params) {
  const sql =
    "INSERT INTO users (First_Name, Last_Name, Password, Latitude, Longitude, Email) VALUES (?, ?, ?, ?, ?, ?);";
  bcrypt.hash(params[2], saltRounds, function (err, hashedPassword) {
    if (err) {
      console.error("Error hashing password:", err);
      throw err;
    } else {
      const result = db.run(sql, [
        params[0],
        params[1],
        hashedPassword,
        params[3],
        params[4],
        params[5],
      ]);
      return result;
    }
  });
}

/**
 * This function updateUserById() updates a user in the database.
 * @param {*} params The parameters of the user to update
 * @returns {Promise<Object>} Returns a promise that resolves to the user that was updated
 */
async function updateUserById(params) {
  const sql =
    "UPDATE users SET First_Name = ?, Last_Name = ?, Latitude = ?, Longitude = ?, Email = ? WHERE id = ?";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
}

/**
 * This function updateUserLocationById() updates the location of a user in the database.
 * @param {*} params The parameters of the user to update
 * @returns {Promise<Object>} Returns a promise that resolves to the user that was updated
 */
async function updateUserLocationById(params) {
  const sql = "UPDATE users SET Latitude = ?, Longitude = ? WHERE id = ?";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error updating user location:", err);
    throw err;
  }
}

/**
 * This function updateUserPasswordById() updates the password of a user in the database.
 * @param {*} params The parameters of the user to update
 */
async function updateUserPasswordById(params) {
  const sql = "UPDATE users SET Password = ? WHERE id = ?";
  bcrypt.hash(params[0], saltRounds, function (err, hashedPassword) {
    if (err) {
      console.error("Error hashing password:", err);
      throw err;
    } else {
      const result = db.run(sql, [hashedPassword, params[1]]);
      return result;
    }
  });
}

/**
 * This function updateUserEmailById() updates the email of a user in the database.
 * @param {*} params The parameters of the user to update
 * @returns {Promise<Object>} Returns a promise that resolves to the user that was updated
 */
async function updateUserEmailById(params) {
  const sql = "UPDATE users SET Email = ? WHERE id = ?";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error updating user email:", err);
    throw err;
  }
}

/**
 * This function deleteUserById() deletes a user from the database.
 * @param {*} id The ID of the user to delete
 * @returns {Promise<Object>} Returns a promise that resolves to the user that was deleted
 */
async function deleteUserById(id) {
  const sql = "DELETE FROM users WHERE id = ?";
  try {
    const result = await db.run(sql, [id]);
    return result;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
}

/**
 * This function getUserByEmail() fetches a user by their email from the database.
 * @param {*} email The email of the user to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the user with the given email
 */
async function getUserByEmail(email) {
  const sql = "SELECT * FROM users WHERE Email = lower(?)";
  try {
    const user = await db.get(sql, [email]);
    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw err;
  }
}

/**
 * This function getUserType() fetches the user type of a user by their ID from the database.
 * @param {*} id The ID of the user to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the user type of the user with the given ID
 */
async function getUserType(id) {
  const sql = "SELECT userType FROM users WHERE id = ?";
  try {
    const user = await db.get(sql, [id]);
    return user;
  } catch (err) {
    console.error("Error fetching user type:", err);
    throw err;
  }
}

/**
 * This function saveResetToken() saves a reset token and expiration date to the database.
 * @param {*} params The parameters of the function
 * @returns {Promise<Object>} Returns a promise that resolves to the result of the function
 */
async function saveResetToken(params) {
  // Convert Date object to timestamp string for consistent storage
  const expirationTimestamp = params[1].getTime().toString();

  const sql =
    "UPDATE users SET resetToken = ?, resetTokenExpiration = ? WHERE id = ?";
  try {
    const result = await db.run(sql, [
      params[0],
      expirationTimestamp,
      params[2],
    ]);
    return result;
  } catch (err) {
    console.error("Error saving reset token:", err);
    throw err;
  }
}

/**
 * This function getUserByResetToken() fetches a user by their reset token from the database.
 * @param {*} token The reset token of the user to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the user with the given reset token
 */
async function getUserByResetToken(token) {
  // Convert current timestamp to the same format as stored in the database
  const currentTime = Date.now().toString();

  const sql = `
      SELECT * FROM users 
      WHERE resetToken = ? 
      AND CAST(resetTokenExpiration AS DECIMAL) > ?
    `;

  try {
    const user = await db.get(sql, [token, currentTime]);
    return user;
  } catch (err) {
    console.error("Error fetching user by reset token:", err);
    throw err;
  }
}

/**
 * This function clearResetToken() clears the reset token from the database.
 * @param {*} id The ID of the user to clear the reset token from
 * @returns {Promise<Object>} Returns a promise that resolves to the result of the function
 */
async function clearResetToken(id) {
  const sql =
    "UPDATE users SET resetToken = NULL, resetTokenExpiration = NULL WHERE id = ?";
  try {
    const result = await db.run(sql, [id]);
    return result;
  } catch (err) {
    console.error("Error clearing reset token:", err);
    throw err;
  }
}

module.exports = {
  getAll,
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
  saveResetToken,
  getUserByResetToken,
  clearResetToken,
  updateUserEmailById,
};
