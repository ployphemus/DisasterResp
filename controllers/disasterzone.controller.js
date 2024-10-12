/**
 * This module contains the controller functions for the disasterzones routes by calling the appropriate disasterzones model function.
 * @module controllers/disasterzone.controller
 * @file This file contains the controller functions for the disasterzones routes by calling the appropriate disasterzones model function.
 */
"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/disasterzone.model");

/**
 * This function getAllDisasterZones() is used to get all the disasterzones from the database by calling the getAll() function from the disasterzone.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllDisasterZones(req, res, next) {
  console.log("getAllDisasterZones called");
  try {
    const disasterzones = await model.getAll();
    /*    
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
      res.render("admin/user-management", {
        loggedIn: loggedIn,
        user_type: user_type,
        user_id: user_id,
      });
    } else {
      res.json(users);
    } 
    */

    console.log("Disasterzones fetched:", disasterzones);
    res.json(disasterzones);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch disasterzones" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getDisasterZoneById() is used to get a disasterzone by its ID from the database by calling the getDisasterZoneById() function from the disasterzone.model.js file.
 * @param {*} req The request object containing the ID of the disasterzone to get from the params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getDisasterZoneById(req, res, next) {
  console.log("getDisasterZoneById called");
  try {
    const disasterZoneId = req.params.id;
    const disasterzone = await model.getDisasterZoneById(disasterZoneId);
    /*    
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
      res.render("admin/user-management", {
        loggedIn: loggedIn,
        user_type: user_type,
        user_id: user_id,
      });
    } else {
      res.json(users);
    } 
    */

    console.log("Disasterzone fetched:", disasterzone);
    res.json(disasterzone);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch disasterzone" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createDisasterZone() is used to create a new disasterzone in the database by calling the createDisasterZone() function from the disasterzone.model.js file.
 * @param {*} req The request object containing the parameters of the disasterzone to create from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createDisasterZone(req, res, next) {
  console.log("createDisasterZone called");
  try {
    let name = req.body.Name;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let radius = req.body.Radius;
    let hexColor = req.body.HexColor;

    const params = [name, latitude, longitude, radius, hexColor];
    const disasterzone = await model.createDisasterZone(params);
    console.log("Disasterzone created:", disasterzone);

    /*
    if (req.accepts("html")) {
      const referer = req.get("referer");
      if (referer && !referer.includes("/auth/register")) {
        res.redirect(referer);
      } else {
        res.redirect("/auth/login");
      }
    } else {
      res.json(user);
    }
    */
    res.json(disasterzone);
  } catch (err) {
    res.status(500).json({ error: "Failed to create disasterzone" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateDisasterZoneById() is used to update a disasterzone by its ID in the database by calling the updateDisasterZoneById() function from the disasterzone.model.js file.
 * @param {*} req The request object containing the parameters of the disasterzone to update from req.body & req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateDisasterZoneById(req, res, next) {
  console.log("updateDisasterZoneById called");
  try {
    let disasterZoneId = req.params.id;
    let name = req.body.Name;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let radius = req.body.Radius;
    let hexColor = req.body.HexColor;

    const tempDisasterZone = await model.getDisasterZoneById(disasterZoneId);
    if (!name) {
      name = tempDisasterZone.Name;
    }

    if (!latitude) {
      latitude = tempDisasterZone.Latitude;
    }

    if (!longitude) {
      longitude = tempDisasterZone.Longitude;
    }

    if (!radius) {
      radius = tempDisasterZone.Radius;
    }

    if (!hexColor) {
      hexColor = tempDisasterZone.HexColor;
    }

    const params = [
      name,
      latitude,
      longitude,
      radius,
      hexColor,
      disasterZoneId,
    ];
    const disasterzone = await model.updateDisasterZoneById(params);
    console.log("Disasterzone updated:", disasterzone);
    //
    res.json(disasterzone);
  } catch (err) {
    res.status(500).json({ error: "Failed to update disasterzone" });
    console.error(err);
    next(err);
  }
}

/**
 * This function deleteDisasterZoneById() is used to delete a disasterzone by its ID in the database by calling the deleteDisasterZoneById() function from the disasterzone
 * @param {*} req The request object containing the ID of the disasterzone to delete, from req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function deleteDisasterZoneById(req, res, next) {
  console.log("deleteDisasterZoneById called");
  try {
    const disasterZoneId = req.params.id;
    const disasterzone = await model.deleteDisasterZoneById(disasterZoneId);
    console.log("Disasterzone deleted:", disasterzone);

    /*
    if (req.accepts("html")) {
      const referer = req.get("referer");
      if (referer) {
        res.redirect(referer);
      } else {
        res.redirect("/");
      }
    } else {
      res.json(user);
    }
    */

    res.json(disasterzone);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete disasterzone" });
    console.error(err);
    next(err);
  }
}

module.exports = {
  getAllDisasterZones,
  getDisasterZoneById,
  createDisasterZone,
  updateDisasterZoneById,
  deleteDisasterZoneById,
};
