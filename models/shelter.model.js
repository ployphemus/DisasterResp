"use strict";
const db = require("./database");

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

async function createShelter(params) {
  const sql =
    "INSERT INTO shelters (Name, Latitude, Longitude, Maximum_Capacity, Current_Capacity) VALUES (?, ?, ?, ?, ?);";
  try {
    const shelter = await db.run(sql, params);
    return shelter;
  } catch (err) {
    console.error("Error creating shelter:", err);
    throw err;
  }
}

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

async function updateShelterByID(params) {
  const sql =
    "UPDATE shelters SET Name = ?, Latitude = ?, Longitude = ?, Maximum_Capacity = ?, Current_Capacity = ? WHERE id = ?";
  try {
    const shelter = await db.run(sql, params);
    return shelter;
  } catch (err) {
    console.error("Error updating shelter:", err);
    throw err;
  }
}

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

module.exports = {
  getAll,
  getShelterById,
  createShelter,
  updateShelterCapByID,
  updateShelterByID,
  deleteShelterByID,
};
