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

module.exports = {
  getAll,
};
