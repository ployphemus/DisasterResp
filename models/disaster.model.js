/**
 * This module contains functions for interacting with the different disaster tables in the database.
 * @module models/disaster.model
 * @file This file contains the functions for interacting with the different disaster tables in the database.
 */
"use strict";
const db = require("./database");

/**
 * This function getAllHurricanes() fetches all hurricanes from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all hurricanes in the database
 */
async function getAllHurricanes() {
  const sql = "SELECT * FROM hurricanes";
  try {
    const hurricanes = await db.all(sql);
    return hurricanes;
  } catch (err) {
    console.error("Error fetching hurricanes:", err);
    throw err;
  }
}

/**
 * This function getHurricaneById() fetches a hurricane by their ID from the database.
 * @param {*} id The ID of the hurricane to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the hurricane with the given ID
 */
async function getHurricaneById(id) {
  const sql = "SELECT * FROM hurricanes WHERE id = ?";
  try {
    const hurricane = await db.get(sql, [id]);
    return hurricane;
  } catch (err) {
    console.error("Error fetching hurricane:", err);
    throw err;
  }
}

/**
 * This function createNewHurricane() creates a new hurricane in the database.
 * @param {*} params The parameters of the hurricane to create
 * @returns {Promise<Object>} Returns a promise that resolves to the hurricane that was created
 */
async function createNewHurricane(params) {
  const sql =
    "INSERT INTO hurricanes (Name, Category, Date, Latitude, Longitude, Wind) VALUES (?, ?, ?, ?, ?, ?)";
  try {
    const hurricane = await db.run(sql, params);
    return hurricane;
  } catch (err) {
    console.error("Error creating hurricane:", err);
    throw err;
  }
}

/**
 * This function updateHurricaneById() updates a hurricane by their ID in the database.
 * @param {*} params The parameters of the hurricane to update
 * @returns {Promise<Object>} Returns a promise that resolves to the hurricane that was updated
 */
async function updateHurricaneById(params) {
  const sql =
    "UPDATE hurricanes SET Name = ?, Category = ?,  Date = ?, Latitude = ?, Longitude = ?, Wind = ? WHERE id = ?";
  try {
    const hurricane = await db.run(sql, params);
    return hurricane;
  } catch (err) {
    console.error("Error updating hurricane:", err);
    throw err;
  }
}

/**
 * This function deleteHurricaneById() deletes a hurricane by their ID from the database.
 * @param {*} id The ID of the hurricane to delete
 * @returns {Promise<Object>} Returns a promise that resolves to the hurricane that was deleted
 */
async function deleteHurricaneById(id) {
  const sql = "DELETE FROM hurricanes WHERE id = ?";
  try {
    const hurricane = await db.run(sql, [id]);
    return hurricane;
  } catch (err) {
    console.error("Error deleting hurricane:", err);
    throw err;
  }
}

/**
 * This function getAllFloods() fetches all floods from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all floods in the database
 */
async function getAllFloods() {
  const sql = "SELECT * FROM floods";
  try {
    const floods = await db.all(sql);
    return floods;
  } catch (err) {
    console.error("Error fetching floods:", err);
    throw err;
  }
}

/**
 * This function getFloodById() fetches a flood by their ID from the database.
 * @param {*} id The ID of the flood to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the flood with the given ID
 */
async function getFloodById(id) {
  const sql = "SELECT * FROM floods WHERE id = ?";
  try {
    const flood = await db.get(sql, [id]);
    return flood;
  } catch (err) {
    console.error("Error fetching flood:", err);
    throw err;
  }
}

/**
 * This function createNewFlood() creates a new flood in the database.
 * @param {*} params The parameters of the flood to create
 * @returns {Promise<Object>} Returns a promise that resolves to the flood that was created
 */
async function createNewFlood(params) {
  const sql =
    "INSERT INTO floods (Latitude, Longitude, Water_level, Date) VALUES (?, ?, ?, ?)";
  try {
    const flood = await db.run(sql, params);
    return flood;
  } catch (err) {
    console.error("Error creating flood:", err);
    throw err;
  }
}

/**
 * This function updateFloodById() updates a flood by their ID in the database.
 * @param {*} params The parameters of the flood to update
 * @returns {Promise<Object>} Returns a promise that resolves to the flood that was updated
 */
async function updateFloodById(params) {
  const sql =
    "UPDATE floods SET Latitude = ?, Longitude = ?, Water_level = ?, Date = ? WHERE id = ?";
  try {
    const flood = await db.run(sql, params);
    return flood;
  } catch (err) {
    console.error("Error updating flood:", err);
    throw err;
  }
}

/**
 * This function deleteFloodById() deletes a flood by their ID from the database.
 * @param {*} id The ID of the flood to delete
 * @returns {Promise<Object>} Returns a promise that resolves to the flood that was deleted
 */
async function deleteFloodById(id) {
  const sql = "DELETE FROM floods WHERE id = ?";
  try {
    const flood = await db.run(sql, [id]);
    return flood;
  } catch (err) {
    console.error("Error deleting flood:", err);
    throw err;
  }
}

/**
 * This function getAllWildfires() fetches all wildfires from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all wildfires in the database
 */
async function getAllWildfires() {
  const sql = "SELECT * FROM fires";
  try {
    const wildfires = await db.all(sql);
    return wildfires;
  } catch (err) {
    console.error("Error fetching wildfires:", err);
    throw err;
  }
}

/**
 * This function getWildfireById() fetches a wildfire by their ID from the database.
 * @param {*} id The ID of the wildfire to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the wildfire with the given ID
 */
async function getWildfireById(id) {
  const sql = "SELECT * FROM fires WHERE id = ?";
  try {
    const wildfire = await db.get(sql, [id]);
    return wildfire;
  } catch (err) {
    console.error("Error fetching wildfire:", err);
    throw err;
  }
}

/**
 * This function createNewWildfire() creates a new wildfire in the database.
 * @param {*} params The parameters of the wildfire to create
 * @returns {Promise<Object>} Returns a promise that resolves to the wildfire that was created
 */
async function createNewWildfire(params) {
  const sql =
    "INSERT INTO fires (Latitude, Longitude, Temperature, Date) VALUES (?, ?, ?, ?)";
  try {
    const wildfire = await db.run(sql, params);
    return wildfire;
  } catch (err) {
    console.error("Error creating wildfire:", err);
    throw err;
  }
}

/**
 * This function updateWildfireById() updates a wildfire by their ID in the database.
 * @param {*} params The parameters of the wildfire to update
 * @returns {Promise<Object>} Returns a promise that resolves to the wildfire that was updated
 */
async function updateWildfireById(params) {
  const sql =
    "UPDATE fires SET Latitude = ?, Longitude = ?, Temperature = ?, Date = ? WHERE id = ?";
  try {
    const wildfire = await db.run(sql, params);
    return wildfire;
  } catch (err) {
    console.error("Error updating wildfire:", err);
    throw err;
  }
}

/**
 * This function deleteWildfireById() deletes a wildfire by their ID from the database.
 * @param {*} id The ID of the wildfire to delete
 * @returns {Promise<Object>} Returns a promise that resolves to the wildfire that was deleted
 */
async function deleteWildfireById(id) {
  const sql = "DELETE FROM fires WHERE id = ?";
  try {
    const wildfire = await db.run(sql, [id]);
    return wildfire;
  } catch (err) {
    console.error("Error deleting wildfire:", err);
    throw err;
  }
}

/**
 * This function getAllTornadoes() fetches all tornadoes from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all tornadoes in the database
 */
async function getAllTornadoes() {
  const sql = "SELECT * FROM tornadoes";
  try {
    const tornadoes = await db.all(sql);
    return tornadoes;
  } catch (err) {
    console.error("Error fetching tornadoes:", err);
    throw err;
  }
}

/**
 * This function getTornadoById() fetches a tornado by their ID from the database.
 * @param {*} id The ID of the tornado to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the tornado with the given ID
 */
async function getTornadoById(id) {
  const sql = "SELECT * FROM tornadoes WHERE id = ?";
  try {
    const tornado = await db.get(sql, [id]);
    return tornado;
  } catch (err) {
    console.error("Error fetching tornado:", err);
    throw err;
  }
}

/**
 * This function createNewTornado() creates a new tornado in the database.
 * @param {*} params The parameters of the tornado to create
 * @returns {Promise<Object>} Returns a promise that resolves to the tornado that was created
 */
async function createNewTornado(params) {
  const sql =
    "INSERT INTO tornadoes (Latitude, Longitude, Wind, Category, Date) VALUES (?, ?, ?, ?, ?)";
  try {
    const tornado = await db.run(sql, params);
    return tornado;
  } catch (err) {
    console.error("Error creating tornado:", err);
    throw err;
  }
}

/**
 * This function updateTornadoById() updates a tornado by their ID in the database.
 * @param {*} params The parameters of the tornado to update
 * @returns {Promise<Object>} Returns a promise that resolves to the tornado that was updated
 */
async function updateTornadoById(params) {
  const sql =
    "UPDATE tornadoes SET Latitude = ?, Longitude = ?, Wind = ?, Category = ?, Date = ? WHERE id = ?";
  try {
    const tornado = await db.run(sql, params);
    return tornado;
  } catch (err) {
    console.error("Error updating tornado:", err);
    throw err;
  }
}

/**
 * This function deleteTornadoById() deletes a tornado by their ID from the database.
 * @param {*} id The ID of the tornado to delete
 * @returns {Promise<Object>} Returns a promise that resolves to the tornado that was deleted
 */
async function deleteTornadoById(id) {
  const sql = "DELETE FROM tornadoes WHERE id = ?";
  try {
    const tornado = await db.run(sql, [id]);
    return tornado;
  } catch (err) {
    console.error("Error deleting tornado:", err);
    throw err;
  }
}

/**
 * This function getAllEarthquakes() fetches all earthquakes from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all earthquakes in the database
 */
async function getAllEarthquakes() {
  const sql = "SELECT * FROM earthquakes";
  try {
    const earthquakes = await db.all(sql);
    return earthquakes;
  } catch (err) {
    console.error("Error fetching earthquakes:", err);
    throw err;
  }
}

/**
 * This function getEarthquakeById() fetches an earthquake by their ID from the database.
 * @param {*} id The ID of the earthquake to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the earthquake with the given ID
 */
async function getEarthquakeById(id) {
  const sql = "SELECT * FROM earthquakes WHERE id = ?";
  try {
    const earthquake = await db.get(sql, [id]);
    return earthquake;
  } catch (err) {
    console.error("Error fetching earthquake:", err);
    throw err;
  }
}

/**
 * This function createNewEarthquake() creates a new earthquake in the database.
 * @param {*} params The parameters of the earthquake to create
 * @returns {Promise<Object>} Returns a promise that resolves to the earthquake that was created
 */
async function createNewEarthquake(params) {
  const sql =
    "INSERT INTO earthquakes (Latitude, Longitude, Magnitude, Date) VALUES (?, ?, ?, ?)";
  try {
    const earthquake = await db.run(sql, params);
    return earthquake;
  } catch (err) {
    console.error("Error creating earthquake:", err);
    throw err;
  }
}

/**
 * This function updateEarthquakeById() updates an earthquake by their ID in the database.
 * @param {*} params The parameters of the earthquake to update
 * @returns {Promise<Object>} Returns a promise that resolves to the earthquake that was updated
 */
async function updateEarthquakeById(params) {
  const sql =
    "UPDATE earthquakes SET Latitude = ?, Longitude = ?, Magnitude = ?, Date = ? WHERE id = ?";
  try {
    const earthquake = await db.run(sql, params);
    return earthquake;
  } catch (err) {
    console.error("Error updating earthquake:", err);
    throw err;
  }
}

/**
 * This function deleteEarthquakeById() deletes an earthquake by their ID from the database.
 * @param {*} id The ID of the earthquake to delete
 * @returns {Promise<Object>} Returns a promise that resolves to the earthquake that was deleted
 */
async function deleteEarthquakeById(id) {
  const sql = "DELETE FROM earthquakes WHERE id = ?";
  try {
    const earthquake = await db.run(sql, [id]);
    return earthquake;
  } catch (err) {
    console.error("Error deleting earthquake:", err);
    throw err;
  }
}

/**
 * This function getAllLandslides() fetches all landslides from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all landslides in the database
 */
async function getAllLandslides() {
  const sql = "SELECT * FROM landslides";
  try {
    const landslides = await db.all(sql);
    return landslides;
  } catch (err) {
    console.error("Error fetching landslides:", err);
    throw err;
  }
}

/**
 * This function getLandslideById() fetches a landslide by their ID from the database.
 * @param {*} id The ID of the landslide to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to the landslide with the given ID
 */
async function getLandslideById(id) {
  const sql = "SELECT * FROM landslides WHERE id = ?";
  try {
    const landslide = await db.get(sql, [id]);
    return landslide;
  } catch (err) {
    console.error("Error fetching landslide:", err);
    throw err;
  }
}

/**
 * This function createNewLandslide() creates a new landslide in the database.
 * @param {*} params The parameters of the landslide to create
 * @returns {Promise<Object>} Returns a promise that resolves to the landslide that was created
 */
async function createNewLandslide(params) {
  const sql =
    "INSERT INTO landslides (Latitude, Longitude, Date) VALUES (?, ?, ?)";
  try {
    const landslide = await db.run(sql, params);
    return landslide;
  } catch (err) {
    console.error("Error creating landslide:", err);
    throw err;
  }
}

/**
 * This function updateLandslideById() updates a landslide by their ID in the database.
 * @param {*} params The parameters of the landslide to update
 * @returns {Promise<Object>} Returns a promise that resolves to the landslide that was updated
 */
async function updateLandslideById(params) {
  const sql =
    "UPDATE landslides SET Latitude = ?, Longitude = ?, Date = ? WHERE id = ?";
  try {
    const landslide = await db.run(sql, params);
    return landslide;
  } catch (err) {
    console.error("Error updating landslide:", err);
    throw err;
  }
}

/**
 * This function deleteLandslideById() deletes a landslide by their ID from the database.
 * @param {*} id The ID of the landslide to delete
 * @returns {Promise<Object>} Returns a promise that resolves to the landslide that was deleted
 */
async function deleteLandslideById(id) {
  const sql = "DELETE FROM landslides WHERE id = ?";
  try {
    const landslide = await db.run(sql, [id]);
    return landslide;
  } catch (err) {
    console.error("Error deleting landslide:", err);
    throw err;
  }
}

module.exports = {
  getAllHurricanes,
  getHurricaneById,
  createNewHurricane,
  updateHurricaneById,
  deleteHurricaneById,
  getAllFloods,
  getFloodById,
  createNewFlood,
  updateFloodById,
  deleteFloodById,
  getAllWildfires,
  getWildfireById,
  createNewWildfire,
  updateWildfireById,
  deleteWildfireById,
  getAllTornadoes,
  getTornadoById,
  createNewTornado,
  updateTornadoById,
  deleteTornadoById,
  getAllEarthquakes,
  getEarthquakeById,
  createNewEarthquake,
  updateEarthquakeById,
  deleteEarthquakeById,
  getAllLandslides,
  getLandslideById,
  createNewLandslide,
  updateLandslideById,
  deleteLandslideById,
};
