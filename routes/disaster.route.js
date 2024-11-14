/**
 * This module contains the routers for the disaster routes by calling the appropriate disaster controller function.
 * @module routes/disaster.route
 * @file This module contains the routers for the disaster routes by calling the appropriate disaster controller function.
 */
"use strict";
const express = require("express");
const router = express.Router();
const disasterController = require("../controllers/disaster.controller");

// Initialize data when server starts
disasterController.initializeData().catch(console.error);

// Get wildfire data for a specific date
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

    const csvData = await disasterController.getWildfireData(date);
    res.set("Content-Type", "text/csv");
    res.send(csvData);
  } catch (error) {
    console.error("Error fetching wildfire data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get wildfire data for the past week
router.get("/wildfires/recent/week", async (req, res) => {
  try {
    const dates = await disasterModel.getPastDays(7);
    const allData = await Promise.all(
      dates.map(async (date) => {
        try {
          const csvData = await disasterController.getWildfireData(date);
          return { date, data: csvData };
        } catch (error) {
          console.error(`Error fetching data for ${date}:`, error);
          return { date, error: error.message };
        }
      })
    );
    res.json(allData);
  } catch (error) {
    console.error("Error fetching weekly data:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
