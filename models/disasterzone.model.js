/**
 * This module contains functions for interacting with the disasterzones table in the database.
 * @module models/disasterzone.model
 * @file This file contains functions for interacting with the disasterzones table in the database.
 */
"use strict";
const db = require("./database");

/**
 * This function getAll() fetches all disasterzones from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all disasterzones in the database
 */
async function getAll() {
  const sql = "SELECT * FROM disasterzones";
  try {
    const disasterzones = await db.all(sql);
    return disasterzones;
  } catch (err) {
    console.error("Error fetching disasterzones:", err);
    throw err;
  }
}

/**
 * This function getDisasterZoneById() fetches a disasterzone by its ID from the database.
 * @param {*} id The ID of the disasterzone to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the disasterzone with the given ID
 */
async function getDisasterZoneById(id) {
  const sql = "SELECT * FROM disasterzones WHERE id = ?";
  try {
    const disasterzone = await db.get(sql, [id]);
    return disasterzone;
  } catch (err) {
    console.error("Error fetching disasterzone by ID:", err);
    throw err;
  }
}

/**
 * this function createDisasterZone() creates a new disasterzone in the database.
 * @param {*} params The parameters of the disasterzone to create
 * @returns {Promise<Object>} Returns a promise that resolves to the disasterzone that was created
 */
/* async function createDisasterZone1(params) {
  const sql =
    "INSERT INTO disasterzones (Name, Latitude, Longitude, Radius, HexColor) VALUES (?, ?, ?, ?, ?);";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error creating disasterzone:", err);
    throw err;
  }
} */
async function createDisasterZone(params) {
  const sql =
    "INSERT INTO disasterzones (Name, Latitude, Longitude, Radius, HexColor) VALUES (?, ?, ?, ?, ?);";
  try {
    const result = await db.run(sql, params);
    if (!result) {
      throw new Error("Database operation failed");
    }
    return {
      id: result.lastID,
      changes: result.changes,
    };
  } catch (err) {
    console.error("Error creating disasterzone:", err);
    throw err;
  }
}

/**
 * This function updateDisasterZoneById() updates a disasterzone in the database by its ID.
 * @param {*} params The parameters of the disasterzone to update
 * @returns {Promise<Object>} Returns a promise that resolves to the disasterzone that was updated
 */
async function updateDisasterZoneById(params) {
  const sql =
    "UPDATE disasterzones SET Name = ?, Latitude = ?, Longitude = ?, Radius = ?, HexColor = ? WHERE id = ?";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error updating disasterzone:", err);
    throw err;
  }
}

/**
 * This function deleteDisasterZoneById() deletes a disasterzone from the database by its ID.
 * @param {*} id The ID of the disasterzone to delete
 * @returns {Promise<Object>} Returns a promise that resolves to the disasterzone that was deleted
 */
async function deleteDisasterZoneById(id) {
  const sql = "DELETE FROM disasterzones WHERE id = ?";
  try {
    const result = await db.run(sql, [id]);
    return result;
  } catch (err) {
    console.error("Error deleting disasterzone:", err);
    throw err;
  }
}

module.exports = {
  getAll,
  getDisasterZoneById,
  createDisasterZone,
  updateDisasterZoneById,
  deleteDisasterZoneById,
};
