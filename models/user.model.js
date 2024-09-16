// user.model.js
"use strict";
const db = require("./database");

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

async function getUserById(id) {
  const sql = "SELECT * FROM users WHERE id = ?";
  try {
    const user = await db.get(sql, [id]);
    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw err;
  }
}

async function createUser(params) {
  const sql =
    "INSERT INTO users (First_Name, Last_Name, Phone_Number, Password, Latitude, Longitude, Email) VALUES (?, ?, ?, ?, ?, ?, ?);";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}

async function updateUserById(params) {
  const sql =
    "UPDATE users SET First_Name = ?, Last_Name = ?, Phone_Number = ?, Password = ?, Latitude = ?, Longitude = ? WHERE id = ?";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
}

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

async function updateUserPhoneNumberById(params) {
  const sql = "UPDATE users SET Phone_Number = ? WHERE id = ?";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error updating user phone number:", err);
    throw err;
  }
}

async function getUserByPhoneNumber(phoneNumber) {
  const sql = "SELECT * FROM users WHERE Phone_Number = ?";
  try {
    const user = await db.get(sql, [phoneNumber]);
    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw err;
  }
}

async function getUserByEmail(email) {
  const sql = "SELECT * FROM users WHERE Email = ?";
  try {
    const user = await db.get(sql, [email]);
    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw err;
  }
}

module.exports = {
  getAll,
  getUserById,
  createUser,
  updateUserById,
  updateUserLocationById,
  deleteUserById,
  updateUserPhoneNumberById,
  getUserByPhoneNumber,
  getUserByEmail,
};
