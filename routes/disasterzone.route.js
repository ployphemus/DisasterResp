/**
 * This module contains the routers for the disasterzones routes by calling the appropriate disasterzones controller function.
 * @module routes/disasterzone.route
 * @file This file contains the routers for the disasterzones routes by calling the appropriate disasterzones controller function.
 */
"use strict";
const express = require("express");
const router = express.Router();

const disasterZoneController = require("../controllers/disasterzone.controller");
const authMiddleware = require("../auth/auth.middleware");

router.get("/all", disasterZoneController.getAllDisasterZones);
router.get("/:id", disasterZoneController.getDisasterZoneById);
router.post(
  "/create",
  authMiddleware.isAdmin,
  disasterZoneController.createDisasterZone
);
router.put(
  "/update/:id",
  authMiddleware.isAdmin,
  disasterZoneController.updateDisasterZoneById
);
router.delete(
  "/delete/:id",
  authMiddleware.isAdmin,
  disasterZoneController.deleteDisasterZoneById
);

module.exports = router;
