/**
 * This module contains functions for interacting with the shelters table in the database.
 * @module models/shelter.model
 * @file This file contains functions for interacting with the shelters table in the database.
 */
"use strict";
const db = require("./database");

/**
 * This function getAll() fetches all shelters from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all shelters in the database
 */
async function getAll() {
  const sql = "SELECT * FROM shelters";
  try {
    const shelters = await db.all(sql);
    return shelters;
  } catch (err) {
    console.error("Error fetching shelters:", err);
    throw err;
  }
}

/**
 * This function getShelterById() fetches a shelter by their ID from the database.
 * @param {*} id The ID of the shelter to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the shelter with the given ID
 */
async function getShelterById(id) {
  const sql = "SELECT * FROM shelters WHERE id = ?";
  try {
    const shelter = await db.get(sql, [id]);
    return shelter;
  } catch (err) {
    console.error("Error fetching shelter:", err);
    throw err;
  }
}

/**
 * This function getShelterLocationById() fetches the location of a shelter by their ID from the database.
 * @param {*} id The ID of the shelter to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the location of the shelter with the given ID
 */
async function getShelterLocationById(id) {
  const sql = "SELECT Latitude, Longitude FROM shelters WHERE id = ?";
  try {
    const shelter = await db.get(sql, [id]);
    return shelter;
  } catch (err) {
    console.error("Error fetching shelter:", err);
    throw err;
  }
}

/**
 * This function getShelterLocationAndAddressById() fetches the location and address of a shelter by their ID from the database.
 * @param {*} id The ID of the shelter to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the location and address of the shelter with the given ID
 */
async function getShelterLocationAndAddressById(id) {
  const sql =
    "SELECT Latitude, Longitude, Shelter_address FROM shelters WHERE id = ?";
  try {
    const shelter = await db.get(sql, [id]);
    return shelter;
  } catch (err) {
    console.error("Error fetching shelter:", err);
    throw err;
  }
}

/**
 * This function createShelter() creates a new shelter in the database.
 * @param {*} params The parameters of the shelter to create
 * @returns {Promise<Object>} Returns a promise that resolves to the shelter that was created
 */
async function createShelter(params) {
  const sql =
    "INSERT INTO shelters (Name, Latitude, Longitude, Shelter_address, Maximum_Capacity, Current_Capacity, disasterzone_id) VALUES (?, ?, ?, ?, ?, ?, ?);";
  try {
    const shelter = await db.run(sql, params);
    return shelter;
  } catch (err) {
    console.error("Error creating shelter:", err);
    throw err;
  }
}

/**
 * This function updateShelterCapByID() updates the current capacity of a shelter by their ID in the database.
 * @param {*} params The parameters of the shelter to update
 * @returns {Promise<Object>} Returns a promise that resolves to the shelter that was updated
 */
async function updateShelterCapByID(params) {
  const sql = "UPDATE shelters SET Current_Capacity = ? WHERE id = ?";
  try {
    const shelter = await db.run(sql, params);
    return shelter;
  } catch (err) {
    console.error("Error updating shelter capacity:", err);
    throw err;
  }
}

/**
 * This function updateShelterByID() updates a shelter by their ID in the database.
 * @param {*} params The parameters of the shelter to update
 * @returns {Promise<Object>} Returns a promise that resolves to the shelter that was updated
 */
async function updateShelterByID(params) {
  const sql =
    "UPDATE shelters SET Name = ?, Latitude = ?, Longitude = ?, Shelter_address = ?, Maximum_Capacity = ?, Current_Capacity = ? WHERE id = ?";
  try {
    const shelter = await db.run(sql, params);
    return shelter;
  } catch (err) {
    console.error("Error updating shelter:", err);
    throw err;
  }
}

/**
 * This function deleteShelterByID() deletes a shelter by their ID from the database.
 * @param {*} id The ID of the shelter to delete
 * @returns {Promise<Object>} Returns a promise that resolves to the shelter that was deleted
 */
async function deleteShelterByID(id) {
  const sql = "DELETE FROM shelters WHERE id = ?";
  try {
    const shelter = await db.run(sql, [id]);
    return shelter;
  } catch (err) {
    console.error("Error deleting shelter:", err);
    throw err;
  }
}

/**
 * This function getAllSheltersAndDisasterZones() fetches all shelters and their associated disaster zones from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all shelters and their associated disaster zones in the database
 */
async function getAllSheltersAndDisasterZones() {
  const sql = `
    SELECT 
      shelters.Name AS shelter_name, 
      shelters.Maximum_Capacity,
      shelters.Current_Capacity, 
      shelters.Shelter_address,
      disasterzones.Name AS disaster_name 
    FROM shelters 
    JOIN disasterzones ON shelters.disasterzone_id = disasterzones.id
  `;
  try {
    const shelters = await db.all(sql);
    return shelters;
  } catch (err) {
    console.error("Error fetching shelters:", err);
    throw err;
  }
}

module.exports = {
  getAll,
  getShelterById,
  getShelterLocationById,
  getShelterLocationAndAddressById,
  createShelter,
  updateShelterCapByID,
  updateShelterByID,
  deleteShelterByID,
  getAllSheltersAndDisasterZones,
};
