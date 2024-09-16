"use strict";
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/all", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/create", userController.createUser);
router.put("/update/:id", userController.updateUserById);
router.put("/updateLocation/:id", userController.updateUserLocationById);
router.delete("/delete/:id", userController.deleteUserById);
router.put("/updatePhoneNumber/:id", userController.updateUserPhoneNumberById);
router.get("/phoneNumber/:phoneNumber", userController.getUserByPhoneNumber);
router.get("/email/:email", userController.getUserByEmail);

module.exports = router;
