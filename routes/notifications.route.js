/**
 * This module contains the routers for the notifications routes by calling the appropriate notifications controller function.
 * @module routes/notifications.route
 * @file This file contains the routers for the notifications routes by calling the appropriate notifications controller function.
 */
"use strict";
const express = require("express");
const router = express.Router();

const notificationsController = require("../controllers/notifications.controller");
const authMiddleware = require("../auth/auth.middleware");

router.get("/all", notificationsController.getAllNotifs);
router.get("/all/users", notificationsController.getAllNotifsUsers);
router.get("/all/AdminId/:id", notificationsController.getAllNotifsByAdminId);
router.get("/all/AdminId/", notificationsController.getAllNotifsByAdminId);
router.get(
  "/all/NotifId-w-users/:id",
  notificationsController.getAllNotifsByNotifIdWithUsers
);
router.get(
  "/all/NotifId-w-users",
  notificationsController.getAllNotifsByNotifIdWithUsers
);
router.get(
  "/all/NotifId-info/:id",
  notificationsController.getAllNotifsByNotifIdWithUsersAndDisasterZone
);
router.get(
  "/all/NotifId-info",
  notificationsController.getAllNotifsByNotifIdWithUsersAndDisasterZone
);
router.get(
  "/all/DisasterId/:id",
  notificationsController.getAllNotifsByDisasterId
);
router.get("/all/DisasterId", notificationsController.getAllNotifsByDisasterId);
router.get(
  "/all/DisasterId-info/:id",
  notificationsController.getAllNotifsByDisasterIdWithUsersAndDisasterZone
);
router.get(
  "/all/DisasterId-info",
  notificationsController.getAllNotifsByDisasterIdWithUsersAndDisasterZone
);
router.post("/create-notif", notificationsController.createNotification);
router.post(
  "/create-notif-broadcast",
  notificationsController.createNotificationAndBroadcast
);
router.post(
  "/create-notif-user",
  notificationsController.createNotificationUser
);
router.put("/update-notif/:id", notificationsController.updateNotificationById);
router.post("/update-notif", notificationsController.updateNotificationById);
router.delete(
  "/delete-notif/:id",
  notificationsController.deleteNotificationById
);
router.get("/delete-notif/:id", notificationsController.deleteNotificationById);

module.exports = router;
