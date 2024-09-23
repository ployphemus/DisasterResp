/**
 * This module contains the controller functions for the disaster routes by calling the appropriate disaster model function.
 * @module controllers/disaster.controller
 * @file This file contains the controller functions for the disaster routes by calling the appropriate disaster model function.
 */
"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/disaster.model");

/**
 * This function getAllHurricanes() is used to get all the hurricanes from the database by calling the getAllHurricanes() function from the disaster.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllHurricanes(req, res, next) {
  console.log("getAllHurricanes called");
  try {
    const hurricanes = await model.getAllHurricanes();
    console.log("Hurricanes fetched:", hurricanes);
    res.json(hurricanes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Hurricanes" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getHurricaneById() is used to get a hurricane by their ID from the database by calling the getHurricaneById() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the hurricane to get from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getHurricaneById(req, res, next) {
  console.log("getHurricaneById called");
  try {
    const hurricaneId = req.params.id;
    const hurricane = await model.getHurricaneById(hurricaneId);
    console.log("Hurricane fetched:", hurricane);
    res.json(hurricane);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Hurricane" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createHurricane() is used to create a new hurricane in the database by calling the createHurricane() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the hurricane to create from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createHurricane(req, res, next) {
  console.log("createHurricane called");
  try {
    let name = req.body.Name;
    let category = req.body.Category;
    let date = req.body.Date;
    let Latitude = req.body.Latitude;
    let Longitude = req.body.Longitude;
    let wind = req.body.Wind;

    const params = [name, category, date, Latitude, Longitude, wind];
    const hurricane = await model.createNewHurricane(params);
    console.log("Hurricane created:", hurricane);
    res.json(hurricane);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Hurricane" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateHurricaneByID() is used to update a hurricane by their ID in the database by calling the updateHurricaneByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the hurricane to update from req.body and req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateHurricaneByID(req, res, next) {
  console.log("updateHurricaneByID called");
  try {
    let name = req.body.Name;
    let category = req.body.Category;
    let date = req.body.Date;
    let Latitude = req.body.Latitude;
    let Longitude = req.body.Longitude;
    let wind = req.body.Wind;
    let hurricaneId = req.params.id;
    const params = [
      name,
      category,
      date,
      Latitude,
      Longitude,
      wind,
      hurricaneId,
    ];
    const hurricane = await model.updateHurricaneById(params);
    console.log("Hurricane updated:", hurricane);
    res.json(hurricane);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Hurricane" });
    console.error(err);
    next(err);
  }
}

/**
 * This function deleteHurricaneByID() is used to delete a hurricane by their ID in the database by calling the deleteHurricaneByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the hurricane to delete from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function deleteHurricaneByID(req, res, next) {
  console.log("deleteHurricaneByID called");
  try {
    const hurricaneId = req.params.id;
    const hurricane = await model.deleteHurricaneById(hurricaneId);
    console.log("Hurricane deleted:", hurricane);
    res.json(hurricane);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Hurricane" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllFloods() is used to get all the floods from the database by calling the getAllFloods() function from the disaster.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllFloods(req, res, next) {
  console.log("getAllFloods called");
  try {
    const floods = await model.getAllFloods();
    console.log("Floods fetched:", floods);
    res.json(floods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Floods" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getFloodById() is used to get a flood by their ID from the database by calling the getFloodById() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the flood are gotten from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getFloodById(req, res, next) {
  console.log("getFloodById called");
  try {
    const floodId = req.params.id;
    const flood = await model.getFloodById(floodId);
    console.log("Flood fetched:", flood);
    res.json(flood);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Flood" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createFlood() is used to create a new flood in the database by calling the createFlood() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the flood to create are gotten from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createFlood(req, res, next) {
  console.log("createFlood called");
  try {
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let waterLevel = req.body.waterlevel;
    let date = req.body.Date;

    const params = [latitude, longitude, waterLevel, date];
    const flood = await model.createNewFlood(params);
    console.log("Flood created:", flood);
    res.json(flood);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Flood" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateFloodByID() is used to update a flood by their ID in the database by calling the updateFloodByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the flood to update are gotten from req.body and req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateFloodByID(req, res, next) {
  console.log("updateFloodByID called");
  try {
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let waterLevel = req.body.waterlevel;
    let date = req.body.Date;
    let floodId = req.params.id;
    const params = [latitude, longitude, waterLevel, date, floodId];
    const flood = await model.updateFloodById(params);
    console.log("Flood updated:", flood);
    res.json(flood);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Flood" });
    console.error(err);
    next(err);
  }
}

/**
 * This function deleteFloodByID() is used to delete a flood by their ID in the database by calling the deleteFloodByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the flood to delete are gotten from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function deleteFloodByID(req, res, next) {
  console.log("deleteFloodByID called");
  try {
    const floodId = req.params.id;
    const flood = await model.deleteFloodById(floodId);
    console.log("Flood deleted:", flood);
    res.json(flood);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Flood" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllWildfires() is used to get all the wildfires from the database by calling the getAllWildfires() function from the disaster.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllWildfires(req, res, next) {
  console.log("getAllWildfires called");
  try {
    const wildfires = await model.getAllWildfires();
    console.log("Wildfires fetched:", wildfires);
    res.json(wildfires);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Wildfires" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getWildfireById() is used to get a wildfire by their ID from the database by calling the getWildfireById() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the wildfire to get are gotten from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getWildfireById(req, res, next) {
  console.log("getWildfireById called");
  try {
    const wildfireId = req.params.id;
    const wildfire = await model.getWildfireById(wildfireId);
    console.log("Wildfire fetched:", wildfire);
    res.json(wildfire);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Wildfire" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createWildfire() is used to create a new wildfire in the database by calling the createWildfire() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the wildfire to create are gotten from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createWildfire(req, res, next) {
  console.log("createWildfire called");
  try {
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let tempature = req.body.Temperature;
    let date = req.body.Date;

    const params = [latitude, longitude, tempature, date];
    const wildfire = await model.createNewWildfire(params);
    console.log("Wildfire created:", wildfire);
    res.json(wildfire);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Wildfire" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateWildfireByID() is used to update a wildfire by their ID in the database by calling the updateWildfireByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the wildfire to update are gotten from req.body and req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateWildfireByID(req, res, next) {
  console.log("updateWildfireByID called");
  try {
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let tempature = req.body.Temperature;
    let date = req.body.Date;
    let wildfireId = req.params.id;
    const params = [latitude, longitude, tempature, date, wildfireId];
    const wildfire = await model.updateWildfireById(params);
    console.log("Wildfire updated:", wildfire);
    res.json(wildfire);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Wildfire" });
    console.error(err);
    next(err);
  }
}

/**
 * This function deleteWildfireByID() is used to delete a wildfire by their ID in the database by calling the deleteWildfireByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the wildfire to delete are gotten from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function deleteWildfireByID(req, res, next) {
  console.log("deleteWildfireByID called");
  try {
    const wildfireId = req.params.id;
    const wildfire = await model.deleteWildfireById(wildfireId);
    console.log("Wildfire deleted:", wildfire);
    res.json(wildfire);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Wildfire" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllTornadoes() is used to get all the tornadoes from the database by calling the getAllTornadoes() function from the disaster.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllTornadoes(req, res, next) {
  console.log("getAllTornadoes called");
  try {
    const tornadoes = await model.getAllTornadoes();
    console.log("Tornadoes fetched:", tornadoes);
    res.json(tornadoes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Tornadoes" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getTornadoById() is used to get a tornado by their ID from the database by calling the getTornadoById() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the tornado to get are gotten from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getTornadoById(req, res, next) {
  console.log("getTornadoById called");
  try {
    const tornadoId = req.params.id;
    const tornado = await model.getTornadoById(tornadoId);
    console.log("Tornado fetched:", tornado);
    res.json(tornado);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Tornado" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createTornado() is used to create a new tornado in the database by calling the createTornado() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the tornado to create are gotten from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createTornado(req, res, next) {
  console.log("createTornado called");
  try {
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let windSpeed = req.body.WindSpeed;
    let category = req.body.Category;
    let date = req.body.Date;

    const params = [latitude, longitude, windSpeed, category, date];
    const tornado = await model.createNewTornado(params);
    console.log("Tornado created:", tornado);
    res.json(tornado);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Tornado" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateTornadoByID() is used to update a tornado by their ID in the database by calling the updateTornadoByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the tornado to update are gotten from req.body and req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateTornadoByID(req, res, next) {
  console.log("updateTornadoByID called");
  try {
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let windSpeed = req.body.WindSpeed;
    let category = req.body.Category;
    let date = req.body.Date;
    let tornadoId = req.params.id;
    const params = [latitude, longitude, windSpeed, category, date, tornadoId];
    const tornado = await model.updateTornadoById(params);
    console.log("Tornado updated:", tornado);
    res.json(tornado);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Tornado" });
    console.error(err);
    next(err);
  }
}

/**
 * This function deleteTornadoByID() is used to delete a tornado by their ID in the database by calling the deleteTornadoByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the tornado to delete are gotten from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function deleteTornadoByID(req, res, next) {
  console.log("deleteTornadoByID called");
  try {
    const tornadoId = req.params.id;
    const tornado = await model.deleteTornadoById(tornadoId);
    console.log("Tornado deleted:", tornado);
    res.json(tornado);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Tornado" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllEarthquakes() is used to get all the earthquakes from the database by calling the getAllEarthquakes() function from the disaster.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllEarthquakes(req, res, next) {
  console.log("getAllEarthquakes called");
  try {
    const earthquakes = await model.getAllEarthquakes();
    console.log("Earthquakes fetched:", earthquakes);
    res.json(earthquakes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Earthquakes" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getEarthquakeById() is used to get an earthquake by their ID from the database by calling the getEarthquakeById() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the earthquake to get are gotten from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getEarthquakeById(req, res, next) {
  console.log("getEarthquakeById called");
  try {
    const earthquakeId = req.params.id;
    const earthquake = await model.getEarthquakeById(earthquakeId);
    console.log("Earthquake fetched:", earthquake);
    res.json(earthquake);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Earthquake" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createEarthquake() is used to create a new earthquake in the database by calling the createEarthquake() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the earthquake to create are gotten from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createEarthquake(req, res, next) {
  console.log("createEarthquake called");
  try {
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let magnitude = req.body.Magnitude;
    let date = req.body.Date;

    const params = [latitude, longitude, magnitude, date];
    const earthquake = await model.createNewEarthquake(params);
    console.log("Earthquake created:", earthquake);
    res.json(earthquake);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Earthquake" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateEarthquakeByID() is used to update an earthquake by their ID in the database by calling the updateEarthquakeByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the earthquake to update are gotten from req.body and req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateEarthquakeByID(req, res, next) {
  console.log("updateEarthquakeByID called");
  try {
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let magnitude = req.body.Magnitude;
    let date = req.body.Date;
    let earthquakeId = req.params.id;
    const params = [latitude, longitude, magnitude, date, earthquakeId];
    const earthquake = await model.updateEarthquakeById(params);
    console.log("Earthquake updated:", earthquake);
    res.json(earthquake);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Earthquake" });
    console.error(err);
    next(err);
  }
}

/**
 * This function deleteEarthquakeByID() is used to delete an earthquake by their ID in the database by calling the deleteEarthquakeByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the earthquake to delete are gotten from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function deleteEarthquakeByID(req, res, next) {
  console.log("deleteEarthquakeByID called");
  try {
    const earthquakeId = req.params.id;
    const earthquake = await model.deleteEarthquakeById(earthquakeId);
    console.log("Earthquake deleted:", earthquake);
    res.json(earthquake);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Earthquake" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllLandslides() is used to get all the landslides from the database by calling the getAllLandslides() function from the disaster.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllLandslides(req, res, next) {
  console.log("getAllLandslides called");
  try {
    const landslides = await model.getAllLandslides();
    console.log("Landslides fetched:", landslides);
    res.json(landslides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Landslides" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getLandslideById() is used to get a landslide by their ID from the database by calling the getLandslideById() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the landslide to get are gotten from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getLandslideById(req, res, next) {
  console.log("getLandslideById called");
  try {
    const landslideId = req.params.id;
    const landslide = await model.getLandslideById(landslideId);
    console.log("Landslide fetched:", landslide);
    res.json(landslide);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Landslide" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createLandslide() is used to create a new landslide in the database by calling the createLandslide() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the landslide to create are gotten from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createLandslide(req, res, next) {
  console.log("createLandslide called");
  try {
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let date = req.body.Date;

    const params = [latitude, longitude, date];
    const landslide = await model.createNewLandslide(params);
    console.log("Landslide created:", landslide);
    res.json(landslide);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Landslide" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateLandslideByID() is used to update a landslide by their ID in the database by calling the updateLandslideByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the landslide to update are gotten from req.body and req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateLandslideByID(req, res, next) {
  console.log("updateLandslideByID called");
  try {
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let date = req.body.Date;
    let landslideId = req.params.id;
    const params = [latitude, longitude, date, landslideId];
    const landslide = await model.updateLandslideById(params);
    console.log("Landslide updated:", landslide);
    res.json(landslide);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Landslide" });
    console.error(err);
    next(err);
  }
}

/**
 * This function deleteLandslideByID() is used to delete a landslide by their ID in the database by calling the deleteLandslideByID() function from the disaster.model.js file.
 * @param {*} req The request object containing the paramaters of the landslide to delete are gotten from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function deleteLandslideByID(req, res, next) {
  console.log("deleteLandslideByID called");
  try {
    const landslideId = req.params.id;
    const landslide = await model.deleteLandslideById(landslideId);
    console.log("Landslide deleted:", landslide);
    res.json(landslide);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Landslide" });
    console.error(err);
    next(err);
  }
}

module.exports = {
  getAllHurricanes,
  getHurricaneById,
  createHurricane,
  updateHurricaneByID,
  deleteHurricaneByID,
  getAllFloods,
  getFloodById,
  createFlood,
  updateFloodByID,
  deleteFloodByID,
  getAllWildfires,
  getWildfireById,
  createWildfire,
  updateWildfireByID,
  deleteWildfireByID,
  getAllTornadoes,
  getTornadoById,
  createTornado,
  updateTornadoByID,
  deleteTornadoByID,
  getAllEarthquakes,
  getEarthquakeById,
  createEarthquake,
  updateEarthquakeByID,
  deleteEarthquakeByID,
  getAllLandslides,
  getLandslideById,
  createLandslide,
  updateLandslideByID,
  deleteLandslideByID,
};
