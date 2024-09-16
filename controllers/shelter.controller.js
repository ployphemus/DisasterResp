"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/shelter.model");

async function getAllShelters(req, res, next) {
  console.log("getAllShelters called");
  try {
    const shelter = await model.getAll();
    console.log("Shelters fetched:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Shelters" });
    console.error(err);
    next(err);
  }
}

async function getShelterById(req, res, next) {
  console.log("getShelterById called");
  try {
    const shelterId = req.params.id;
    const shelter = await model.getShelterById(shelterId);
    console.log("Shelter fetched:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Shelter" });
    console.error(err);
    next(err);
  }
}

async function createShelter(req, res, next) {
  console.log("createShelter called");
  try {
    let name = req.body.Name;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let maxCapacity = req.body.Maximum_Capacity;
    let currentCapacity = req.body.Current_Capacity;

    const params = [name, latitude, longitude, maxCapacity, currentCapacity];
    const shelter = await model.createShelter(params);
    console.log("Shelter created:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Shelter" });
    console.error(err);
    next(err);
  }
}

async function updateShelterCapByID(req, res, next) {
  console.log("updateShelterCapByID called");
  try {
    let currentCapacity = req.body.Current_Capacity;
    let shelterId = req.params.id;
    const params = [currentCapacity, shelterId];
    const shelter = await model.updateShelterCapByID(params);
    console.log("Shelter updated:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Shelter" });
    console.error(err);
    next(err);
  }
}

async function updateShelterByID(req, res, next) {
  console.log("updateShelterByID called");
  try {
    let name = req.body.Name;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let maxCapacity = req.body.Maximum_Capacity;
    let currentCapacity = req.body.Current_Capacity;
    let shelterId = req.params.id;
    const params = [
      name,
      latitude,
      longitude,
      maxCapacity,
      currentCapacity,
      shelterId,
    ];
    const shelter = await model.updateShelterByID(params);
    console.log("Shelter updated:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Shelter" });
    console.error(err);
    next(err);
  }
}

async function deleteShelterByID(req, res, next) {
  console.log("deleteShelterByID called");
  try {
    const shelterId = req.params.id;
    const shelter = await model.deleteShelterByID(shelterId);
    console.log("Shelter deleted:", shelter);
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete Shelter" });
    console.error(err);
    next(err);
  }
}

module.exports = {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelterCapByID,
  updateShelterByID,
  deleteShelterByID,
};
