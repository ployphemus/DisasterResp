/**
 * This module contains the controller functions for the disaster routes by calling the appropriate disaster model function.
 * @module controllers/disaster.controller
 * @file This file contains the controller functions for the disaster routes by calling the appropriate disaster model function.
 */
"use strict";
const express = require("express");
const app = express();
const axios = require("axios");
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/disaster.model");

async function fetchWildfireData(apiKey, date) {
  const layer = "VIIRS_SNPP_NRT";
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/${layer}/world/1/0/${date}`;

  try {
    console.log(`Fetching NASA data for ${date}...`);
    const response = await axios.get(url);

    if (!response.data || response.data.trim().length === 0) {
      throw new Error("Empty response from NASA API");
    }
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Invalid NASA API key");
    } else if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw error;
  }
}

async function initializeData() {
  try {
    const dates = await model.initialize();
    console.log("Checking data for dates:", dates);

    for (const date of dates) {
      const exists = await model.getWildfiresByDate(date);
      if (!exists) {
        console.log(`Fetching new data for ${date}...`);
        const csvData = await fetchWildfireData(process.env.NASA_API_KEY, date);
        await model.saveWildfireData(date, csvData);
        console.log(`Saved CSV data for ${date}`);
      }
    }
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

async function getWildfireData(date) {
  try {
    // Check if we have cached data
    let data = await model.getWildfiresByDate(date);

    // If no cached data, fetch from API
    if (!data) {
      data = await fetchWildfireData(process.env.NASA_API_KEY, date);
      if (data) {
        await model.saveWildfireData(date, data);
      }
    }

    if (!data) {
      throw new Error("No wildfire data available for this date");
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to get wildfire data: ${error.message}`);
  }
}

if (!process.env.NASA_API_KEY) {
  console.error("NASA_API_KEY not found");
  process.exit(1);
}

module.exports = { initializeData, getWildfireData };
