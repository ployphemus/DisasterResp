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
router.post(
  "/create-notif",
  authMiddleware.isAdmin,
  notificationsController.createNotification
);
router.post(
  "/create-notif-broadcast",
  authMiddleware.isAdmin,
  notificationsController.createNotificationAndBroadcast
);
router.post(
  "/create-notif-user",
  authMiddleware.isAdmin,
  notificationsController.createNotificationUser
);
router.put(
  "/update-notif/:id",
  authMiddleware.isAdmin,
  notificationsController.updateNotificationById
);
router.post(
  "/update-notif",
  authMiddleware.isAdmin,
  notificationsController.updateNotificationById
);
router.delete(
  "/delete-notif/:id",
  authMiddleware.isAdmin,
  notificationsController.deleteNotificationById
);
router.get(
  "/delete-notif/:id",
  authMiddleware.isAdmin,
  notificationsController.deleteNotificationById
);

module.exports = router;
