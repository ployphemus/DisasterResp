/**
 * This module contains the routers for the disaster routes by calling the appropriate disaster controller function.
 * @module routes/disaster.route
 * @file This module contains the routers for the disaster routes by calling the appropriate disaster controller function.
 */
"use strict";
const express = require("express");
const router = express.Router();

const controller = require("../controllers/disaster.controller");

router.get("/wildfires/:date", async (req, res) => {
  try {
    const { date } = req.params;

    // Basic date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use YYYY-MM-DD" });
    }

    // Prevent future dates
    const requestDate = new Date(date);
    const today = new Date();
    if (requestDate > today) {
      return res.status(400).json({ error: "Cannot request future dates" });
    }

    const csvData = await controller.getWildfireData(date);
    res.set("Content-Type", "text/csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FINISH THIS UP

module.exports = router;
