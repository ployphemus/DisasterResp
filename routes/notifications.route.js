/**
 * This module contains the routers for the notifications routes by calling the appropriate notifications controller function.
 * @module routes/notifications.route
 * @file This file contains the routers for the notifications routes by calling the appropriate notifications controller function.
 */
"use strict";
const express = require("express");
const router = express.Router();

const disasterZoneController = require("../controllers/notifications.controller");
const authMiddleware = require("../auth/auth.middleware");

router.get("/all", disasterZoneController.getAllNotifs);
router.get("/all/users", disasterZoneController.getAllNotifsUsers);
router.get("/all/AdminId/:id", disasterZoneController.getAllNotifsByAdminId);
router.get("/all/AdminId/", disasterZoneController.getAllNotifsByAdminId);
router.get(
  "/all/NotifId-w-users/:id",
  disasterZoneController.getAllNotifsByNotifIdWithUsers
);
router.get(
  "/all/NotifId-w-users",
  disasterZoneController.getAllNotifsByNotifIdWithUsers
);
router.get(
  "/all/NotifId-info/:id",
  disasterZoneController.getAllNotifsByNotifIdWithUsersAndDisasterZone
);
router.get(
  "/all/NotifId-info",
  disasterZoneController.getAllNotifsByNotifIdWithUsersAndDisasterZone
);
router.get(
  "/all/DisasterId/:id",
  disasterZoneController.getAllNotifsByDisasterId
);
router.get("/all/DisasterId", disasterZoneController.getAllNotifsByDisasterId);
router.get(
  "/all/DisasterId-info/:id",
  disasterZoneController.getAllNotifsByDisasterIdWithUsersAndDisasterZone
);
router.get(
  "/all/DisasterId-info",
  disasterZoneController.getAllNotifsByDisasterIdWithUsersAndDisasterZone
);
router.post("/create-notif", disasterZoneController.createNotification);
router.post(
  "/create-notif-user",
  disasterZoneController.createNotificationUser
);
router.put("/update-notif/:id", disasterZoneController.updateNotificationById);
router.post("/update-notif", disasterZoneController.updateNotificationById);
router.delete(
  "/delete-notif/:id",
  disasterZoneController.deleteNotificationById
);
router.get("/delete-notif/:id", disasterZoneController.deleteNotificationById);

module.exports = router;
