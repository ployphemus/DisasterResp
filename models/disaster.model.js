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

async function initialize() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    return getPastDays(7); // Get last 7 days of data
  } catch (error) {
    throw new Error(`Failed to create data directory: ${error.message}`);
  }
}

async function saveWildfireData(date, csvData) {
  const filePath = path.join(dataDir, `${date}.csv`);
  try {
    await fs.writeFile(filePath, csvData);
  } catch (error) {
    throw new Error(`Error saving CSV data: ${error.message}`);
  }
}

async function getWildfiresByDate(date) {
  const filePath = path.join(dataDir, `${date}.csv`);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(`Error reading CSV data: ${error.message}`);
  }
}

function getPastDays(days) {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i - 1);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

module.exports = {
  initialize,
  saveWildfireData,
  getWildfiresByDate,
};
