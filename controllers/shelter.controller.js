/**
 * This module contains the controller functions for the shelter routes by calling the appropriate shelter model function.
 * @module controllers/shelter.controller
 * @file This file contains the controller functions for the shelter routes by calling the appropriate shelter model function.
 */
"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/shelter.model");

/**
 * This function getAllShelters() is used to get all the shelters from the database by calling the getAll() function from the shelter.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllShelters(req, res, next) {
  console.log("getAllShelters called");
  try {
    const shelter = await model.getAll();
    console.log("Shelters fetched:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Shelters" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getShelterById() is used to get a shelter by their ID from the database by calling the getShelterById() function from the shelter.model.js file.
 * @param {*} req The request object containing the paramaters of the shelter to get from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getShelterById(req, res, next) {
  console.log("getShelterById called");
  try {
    const shelterId = req.params.id;
    const shelter = await model.getShelterById(shelterId);
    console.log("Shelter fetched:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Shelter" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createShelter() is used to create a new shelter in the database by calling the createShelter() function from the shelter.model.js file.
 * @param {*} req The request object containing the paramaters of the shelter to create from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createShelter(req, res, next) {
  console.log("createShelter called");
  try {
    let name = req.body.Name;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let Shelter_address = req.body.Shelter_address;
    let maxCapacity = req.body.Maximum_Capacity;
    let currentCapacity = req.body.Current_Capacity;
    let disasterzone_id = req.body.disasterzone_id;

    if (maxCapacity === undefined || maxCapacity === null) {
      maxCapacity = 250;
    }

    const params = [
      name,
      latitude,
      longitude,
      Shelter_address,
      maxCapacity,
      currentCapacity,
      disasterzone_id,
    ];
    const shelter = await model.createShelter(params);
    console.log("Shelter created:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Shelter" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateShelterCapByID() is used to update the current capacity of a shelter by their ID in the database by calling the updateShelterCapByID() function from the shelter.model.js file.
 * @param {*} req The request object containing the paramaters of the shelter to update from req.body and req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateShelterCapByID(req, res, next) {
  console.log("updateShelterCapByID called");
  try {
    let currentCapacity = req.body.Current_Capacity;
    let shelterId = req.params.id;
    const params = [currentCapacity, shelterId];
    const shelter = await model.updateShelterCapByID(params);
    console.log("Shelter updated:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Shelter" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateShelterByID() is used to update a shelter by their ID in the database by calling the updateShelterByID() function from the shelter.model.js file.
 * @param {*} req The request object containing the paramaters of the shelter to update from req.body and req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateShelterByID(req, res, next) {
  console.log("updateShelterByID called");
  try {
    let name = req.body.Name;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let Shelter_address = req.body.Shelter_address;
    let maxCapacity = req.body.Maximum_Capacity;
    let currentCapacity = req.body.Current_Capacity;
    let shelterId = req.params.id;
    const params = [
      name,
      latitude,
      longitude,
      Shelter_address,
      maxCapacity,
      currentCapacity,
      shelterId,
    ];
    const shelter = await model.updateShelterByID(params);
    console.log("Shelter updated:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Shelter" });
    console.error(err);
    next(err);
  }
}

/**
 * This function deleteShelterByID() is used to delete a shelter by their ID in the database by calling the deleteShelterByID() function from the shelter.model.js file.
 * @param {*} req The request object containing the paramaters of the shelter to delete from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function deleteShelterByID(req, res, next) {
  console.log("deleteShelterByID called");
  try {
    const shelterId = req.params.id;
    const shelter = await model.deleteShelterByID(shelterId);
    console.log("Shelter deleted:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Shelter" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllSheltersAndDisasterZones() is used to get all the shelters and disaster zones from the database by calling the getAllSheltersAndDisasterZones() function from the shelter.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllSheltersAndDisasterZones(req, res, next) {
  console.log("getAllSheltersAndDisasterZones called");
  try {
    const shelters = await model.getAllSheltersAndDisasterZones();
    console.log("Shelters fetched:", shelters);
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
      res.render("shelters/user_shelters", {
        shelters: shelters,
        loggedIn: loggedIn,
        user_type: user_type,
        user_id: user_id,
      });
    } else {
      res.json(shelters);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Shelters" });
    console.error(err);
    next(err);
  }
}

module.exports = {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelterCapByID,
  updateShelterByID,
  deleteShelterByID,
  getAllSheltersAndDisasterZones,
};
