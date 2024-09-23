/**
 * This module contains the routers for the disaster routes by calling the appropriate disaster controller function.
 * @module routes/disaster.route
 * @file This module contains the routers for the disaster routes by calling the appropriate disaster controller function.
 */
"use strict";
const express = require("express");
const router = express.Router();

const controller = require("../controllers/disaster.controller");

router.get("/hurricanes/all", controller.getAllHurricanes);
router.get("/hurricanes/:id", controller.getHurricaneById);
router.post("/hurricanes/create", controller.createHurricane);
router.put("/hurricanes/update/:id", controller.updateHurricaneByID);
router.delete("/hurricanes/delete/:id", controller.deleteHurricaneByID);

router.get("/floods/all", controller.getAllFloods);
router.get("/floods/:id", controller.getFloodById);
router.post("/floods/create", controller.createFlood);
router.put("/floods/update/:id", controller.updateFloodByID);
router.delete("/floods/delete/:id", controller.deleteFloodByID);

router.get("/wildfires/all", controller.getAllWildfires);
router.get("/wildfires/:id", controller.getWildfireById);
router.post("/wildfires/create", controller.createWildfire);
router.put("/wildfires/update/:id", controller.updateWildfireByID);
router.delete("/wildfires/delete/:id", controller.deleteWildfireByID);

router.get("/tornadoes/all", controller.getAllTornadoes);
router.get("/tornadoes/:id", controller.getTornadoById);
router.post("/tornadoes/create", controller.createTornado);
router.put("/tornadoes/update/:id", controller.updateTornadoByID);
router.delete("/tornadoes/delete/:id", controller.deleteTornadoByID);

router.get("/earthquakes/all", controller.getAllEarthquakes);
router.get("/earthquakes/:id", controller.getEarthquakeById);
router.post("/earthquakes/create", controller.createEarthquake);
router.put("/earthquakes/update/:id", controller.updateEarthquakeByID);
router.delete("/earthquakes/delete/:id", controller.deleteEarthquakeByID);

router.get("/landslides/all", controller.getAllLandslides);
router.get("/landslides/:id", controller.getLandslideById);
router.post("/landslides/create", controller.createLandslide);
router.put("/landslides/update/:id", controller.updateLandslideByID);
router.delete("/landslides/delete/:id", controller.deleteLandslideByID);

module.exports = router;
