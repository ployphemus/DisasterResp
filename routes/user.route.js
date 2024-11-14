/**
 * This module contains the routers for the user routes by calling the appropriate user controller function.
 * @module routes/user.route
 * @file This file contains the routers for the user routes by calling the appropriate user controller function.
 */
"use strict";
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../auth/auth.middleware");

router.get("/all", authMiddleware.isAdmin, userController.getAllUsers);
router.get(
  "/admin/dashboard",
  authMiddleware.isAdmin,
  userController.getAdminDashboard
);
router.get(
  "/admin/shelters",
  authMiddleware.isAdmin,
  userController.getAdminShelters
);
router.get(
  "/admin/alerts",
  authMiddleware.isAdmin,
  userController.getAdminAlertPage
);
router.get("/resources", userController.getUserResources);
router.get(
  "/:id",
  authMiddleware.isMatchingUserOrAdmin,
  userController.getUserById
);
router.get(
  "/location/:id",
  authMiddleware.isMatchingUserOrAdmin,
  userController.getUserLocationById
);
router.post("/create", userController.createUser);
router.post("/createNewUser", userController.createNewUser);
router.put(
  "/update/:id",
  authMiddleware.isMatchingUserOrAdmin,
  userController.updateUserById
);
router.put(
  "/updateLocation/:id",
  authMiddleware.isMatchingUserOrAdmin,
  userController.updateUserLocationById
);
router.delete(
  "/delete/:id",
  authMiddleware.isMatchingUserOrAdmin,
  userController.deleteUserById
);
router.get(
  "/delete/:id",
  authMiddleware.isMatchingUserOrAdmin,
  userController.deleteUserById
);
router.get(
  "/email/:email",
  authMiddleware.isMatchingUserOrAdmin,
  userController.getUserByEmail
);
router.get(
  "/userType/:id",
  authMiddleware.isMatchingUserOrAdmin,
  userController.getUserType
);

module.exports = router;
