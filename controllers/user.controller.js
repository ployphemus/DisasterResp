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

module.exports = {
  getAllUsers,
};
