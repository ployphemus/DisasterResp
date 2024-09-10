"use strict";
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/all", userController.getAllUsers);

module.exports = router;
