"use strict";
const express = require("express");
const router = express.Router();

const controller = require("../controllers/shelter.controller");

router.get("/all", controller.getAllShelters);
router.get("/:id", controller.getShelterById);
router.post("/createShelter", controller.createShelter);

module.exports = router;
