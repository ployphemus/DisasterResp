/**
 * This module contains functions for interacting with the different disaster tables in the database.
 * @module models/disaster.model
 * @file This file contains the functions for interacting with the different disaster tables in the database.
 */
"use strict";
/**
 * This module contains the routers for the disaster routes by calling the appropriate disaster controller function.
 * @module routes/disaster.route
 * @file This module contains the routers for the disaster routes by calling the appropriate disaster controller function.
 */
"use strict";
const fs = require("fs").promises;
const path = require("path");

const dataDir = path.join(__dirname, "../data/wildfires");

/**
 * This function initialize() creates the data directory and returns the past 7 days in ISO format by calling getPastDays(7) function.
 * @returns {string[]} An array of the past 7 days in ISO format
 */
async function initialize() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    return getPastDays(7);
  } catch (error) {
    throw new Error(`Failed to create data directory: ${error.message}`);
  }
}

/**
 * This function saveWildfireData() saves the wildfire data for a specific date.
 * @param {*} date The date to save the wildfire data for
 * @param {*} csvData The CSV data to save
 */
async function saveWildfireData(date, csvData) {
  const filePath = path.join(dataDir, `${date}.csv`);
  try {
    await fs.writeFile(filePath, csvData);
  } catch (error) {
    throw new Error(`Error saving CSV data: ${error.message}`);
  }
}

/**
 * This function getWildfiresByDate() retrieves the wildfire data for a specific date.
 * @param {*} date The date to retrieve the wildfire data for
 * @returns {string} The CSV data for the specified date
 */
async function getWildfiresByDate(date) {
  const filePath = path.join(dataDir, `${date}.csv`);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(`Error reading CSV data: ${error.message}`);
  }
}

/**
 * This function getPastDays() returns an array of the past days in ISO format.
 * @param {*} days The number of past days to retrieve
 * @returns {string[]} An array of the past days in ISO format
 */
function getPastDays(days) {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

module.exports = {
  initialize,
  saveWildfireData,
  getWildfiresByDate,
  getPastDays,
};
