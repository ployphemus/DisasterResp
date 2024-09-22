/**
 * This module contains the routers for the shelter routes by calling the appropriate shelter controller function.
 * @module routes/shelter.route
 * @file This file contains the routers for the shelter routes by calling the appropriate shelter controller function.
 */
"use strict";
const express = require("express");
const router = express.Router();

const controller = require("../controllers/shelter.controller");

router.get("/all", controller.getAllShelters);
router.get("/:id", controller.getShelterById);
router.post("/createShelter", controller.createShelter);
router.put("/updateShelterCapByID/:id", controller.updateShelterCapByID);
router.put("/updateShelterByID/:id", controller.updateShelterByID);
router.delete("/deleteShelterByID/:id", controller.deleteShelterByID);

module.exports = router;
