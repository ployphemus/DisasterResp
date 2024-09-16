"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/user.model");

async function getAllUsers(req, res, next) {
  console.log("getAllUsers called");
  try {
    const users = await model.getAll();
    console.log("Users fetched:", users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
    console.error(err);
    next(err);
  }
}

async function getUserById(req, res, next) {
  console.log("getUserById called");
  try {
    const userId = req.params.id;
    const user = await model.getUserById(userId);
    console.log("User fetched:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
    console.error(err);
    next(err);
  }
}

async function createUser(req, res, next) {
  console.log("createUser called");
  try {
    let firstName = req.body.First_Name;
    let lastName = req.body.Last_Name;
    let phoneNumber = req.body.Phone_Number;
    let password = req.body.Password;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;
    let email = req.body.Email;

    const params = [
      firstName,
      lastName,
      phoneNumber,
      password,
      latitude,
      longitude,
      email,
    ];
    const user = await model.createUser(params);
    console.log("User created:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
    console.error(err);
    next(err);
  }
}

async function updateUserById(req, res, next) {
  console.log("updateUserById called");
  try {
    let userId = req.params.id;
    let firstName = req.body.First_Name;
    let lastName = req.body.Last_Name;
    let phoneNumber = req.body.Phone_Number;
    let password = req.body.Password;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;

    const params = [
      firstName,
      lastName,
      phoneNumber,
      password,
      latitude,
      longitude,
      userId,
    ];
    const user = await model.updateUserById(params);
    console.log("User updated:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
    console.error(err);
    next(err);
  }
}

async function updateUserLocationById(req, res, next) {
  console.log("updateUserLocationById called");
  try {
    let userId = req.params.id;
    let latitude = req.body.Latitude;
    let longitude = req.body.Longitude;

    const params = [latitude, longitude, userId];
    const user = await model.updateUserLocationById(params);
    console.log("User location updated:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user location" });
    console.error(err);
    next(err);
  }
}

async function deleteUserById(req, res, next) {
  console.log("deleteUserById called");
  try {
    const userId = req.params.id;
    const user = await model.deleteUserById(userId);
    console.log("User deleted:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
    console.error(err);
    next(err);
  }
}

async function updateUserPhoneNumberById(req, res, next) {
  console.log("updateUserPhoneNumberById called");
  try {
    let userId = req.params.id;
    let phoneNumber = req.body.Phone_Number;

    const params = [phoneNumber, userId];
    const user = await model.updateUserPhoneNumberById(params);
    console.log("User phone number updated:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user phone number" });
    console.error(err);
    next(err);
  }
}

async function getUserByPhoneNumber(req, res, next) {
  console.log("getUserByPhoneNumber called");
  try {
    let phoneNumber = req.params.phoneNumber;
    const user = await model.getUserByPhoneNumber(phoneNumber);
    console.log("User fetched:", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
    console.error(err);
    next(err);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserLocationById,
  deleteUserById,
  updateUserPhoneNumberById,
  getUserByPhoneNumber,
};
