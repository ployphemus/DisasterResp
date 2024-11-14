/**
 * This module contains the routers for the shelter routes by calling the appropriate shelter controller function.
 * @module routes/shelter.route
 * @file This file contains the routers for the shelter routes by calling the appropriate shelter controller function.
 */
"use strict";
const express = require("express");
const router = express.Router();

const controller = require("../controllers/shelter.controller");
const authMiddleware = require("../auth/auth.middleware");

router.get("/all", controller.getAllShelters);
router.get(
  "/allSheltersAndDisasterZones",
  controller.getAllSheltersAndDisasterZones,
  authMiddleware.extractUserInfo
);
router.get("/getlocation/:id", controller.getShelterLocationById);
router.get(
  "/getlocationandaddress/:id",
  controller.getShelterLocationAndAddressById
);
router.get("/:id", controller.getShelterById);
router.post("/createShelter", authMiddleware.isAdmin, controller.createShelter);
router.put("/updateShelterCapByID/:id", controller.updateShelterCapByID);
router.put(
  "/updateShelterByID/:id",
  authMiddleware.isAdmin,
  controller.updateShelterByID
);
router.delete(
  "/deleteShelterByID/:id",
  authMiddleware.isAdmin,
  controller.deleteShelterByID
);

module.exports = router;
