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

const disasterModel = require("../models/disaster.model");

/**
 * This function fetchWildfireData() fetches wildfire data from the NASA API.
 * @param {*} apiKey The API key to use for the request
 * @param {*} date The date to fetch the data for
 * @returns {string} The CSV data for the specified date
 */
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

/**
 * This function initializeData() initializes the wildfire data by fetching data for the past 7 days.
 */
async function initializeData() {
  try {
    const dates = await disasterModel.initialize();
    console.log("Checking data for dates:", dates);

    for (const date of dates) {
      const exists = await disasterModel.getWildfiresByDate(date);
      if (!exists) {
        console.log(`Fetching new data for ${date}...`);
        const csvData = await fetchWildfireData(process.env.NASA_API_KEY, date);
        await disasterModel.saveWildfireData(date, csvData);
        console.log(`Saved CSV data for ${date}`);
      }
    }
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

/**
 * This function getWildfireData() retrieves the wildfire data for a specific date.
 * @param {*} date The date to retrieve the wildfire data
 * @returns {string} The CSV data for the specified date
 */
async function getWildfireData(date) {
  try {
    let data = await disasterModel.getWildfiresByDate(date);

    if (!data) {
      data = await fetchWildfireData(process.env.NASA_API_KEY, date);
      if (data) {
        await disasterModel.saveWildfireData(date, data);
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

module.exports = {
  fetchWildfireData,
  initializeData,
  getWildfireData,
};
