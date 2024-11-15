/**
 * This module contains the controller functions for the notifications routes by calling the appropriate notifications model function.
 * @module controllers/notifications.controller
 * @file This file contains the controller functions for the notifications routes by calling the appropriate notifications model function.
 */
"use strict";
const express = require("express");
const app = express();
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/notifications.model");
const disasterZoneModel = require("../models/disasterzone.model");
const userModel = require("../models/user.model");

let io;

const setIo = (socketIo) => {
  io = socketIo;
};
const { sendEmailFunc } = require("../middleware/nodemailer");

/**
 * This function getAllNotifs() is used to get all the notifications from the database by calling the getAllNotifs() function from the notifications.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllNotifs(req, res, next) {
  console.log("getAllNotifs called");
  try {
    const notifications = await model.getAllNotifs();
    console.log("Notifications fetched:", notifications);
    /*    
    let loggedIn = req.user ? true : false;
    let user_type = null;
    let user_id = null;
    if (req.user) {
      user_type = req.user.userType;
      user_id = req.user.id;
    }
    console.log("Logged in:", loggedIn);
    console.log("User type:", user_type);
    console.log("User ID:", user_id);
 
    if (req.accepts("html")) {
      res.render("admin/user-management", {
        loggedIn: loggedIn,
        user_type: user_type,
        user_id: user_id,
      });
    } else {
      res.json(users);
    } 
    */
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllNotifsUsers() is used to get all the notifications_users from the database by calling the getAllNotifsUsers() function from the notifications.model.js file.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllNotifsUsers(req, res, next) {
  console.log("getAllNotifsUsers called");
  try {
    const notificationUsers = await model.getAllNotifsUsers();
    console.log("Notification users fetched:", notificationUsers);
    res.json(notificationUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notification users" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllNotifsByAdminId() is used to get all the notifications by admin ID from the database by calling the getAllNotifsByAdminId() function from the notifications.model.js file.
 * @param {*} req The request object containing the ID of the admin to get notifications from the params or body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllNotifsByAdminId(req, res, next) {
  console.log("getAllNotifsByAdminId called");
  try {
    const adminId = req.params.id || req.body.id;
    const notifications = await model.getAllNotifsByAdminId(adminId);
    console.log("Notifications fetched:", notifications);
    res.json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch notifications by admin ID" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllNotifsByNotifIdWithUsers() is used to get all the notifications and its users by the notification ID from the database by calling the getAllNotifsByNotifIdWithUsers() function from the notifications.model.js file.
 * @param {*} req The request object containing the ID of the notification to get from the params or body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllNotifsByNotifIdWithUsers(req, res, next) {
  console.log("getAllNotifsByNotifIdWithUsers called");
  try {
    const notifId = req.params.id || req.body.id;
    const notifications = await model.getAllNotifsByNotifIdWithUsers(notifId);
    console.log("Notifications fetched:", notifications);
    res.json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch notifications by notification ID" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllNotifsByNotifIdWithUsersAndDisasterZone() is used to get all the notifications and its users and disasterzone by the notification ID from the database by calling the getAllNotifsByNotifIdWithUsersAndDisasterZone() function from the notifications.model.js file.
 * @param {*} req The request object containing the ID of the notification to get from the params or body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllNotifsByNotifIdWithUsersAndDisasterZone(req, res, next) {
  console.log("getAllNotifsByNotifIdWithUsersAndDisasterZone called");
  try {
    const notifId = req.params.id || req.body.id;
    const notifications =
      await model.getAllNotifsByNotifIdWithUsersAndDisasterZone(notifId);
    console.log("Notifications fetched:", notifications);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      error:
        "Failed to fetch notifications by notification ID with users and disasterzone",
    });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllNotifsByDisasterId() is used to get all the notifications by disaster ID from the database by calling the getAllNotifsByDisasterId() function from the notifications.model.js file.
 * @param {*} req The request object containing the ID of the disaster to get notifications from the params or body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllNotifsByDisasterId(req, res, next) {
  console.log("getAllNotifsByDisasterId called");
  try {
    const disasterId = req.params.id || req.body.id;
    const notifications = await model.getAllNotifsByDisasterId(disasterId);
    console.log("Notifications fetched:", notifications);
    res.json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch notifications by disaster ID" });
    console.error(err);
    next(err);
  }
}

/**
 * This function getAllNotifsByDisasterIdWithUsersAndDisasterZone() is used to get all the notifications and its users and disasterzone by the disaster ID from the database by calling the getAllNotifsByDisasterIdWithUsersAndDisasterZone() function from the notifications.model.js file.
 * @param {*} req The request object containing the ID of the disaster to get notifications from the params or body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function getAllNotifsByDisasterIdWithUsersAndDisasterZone(
  req,
  res,
  next
) {
  console.log("getAllNotifsByDisasterIdWithUsersAndDisasterZone called");
  try {
    const disasterId = req.params.id || req.body.id;
    const notifications =
      await model.getAllNotifsByDisasterIdWithUsersAndDisasterZone(disasterId);
    console.log("Notifications fetched:", notifications);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      error:
        "Failed to fetch notifications by disaster ID with users and disasterzone",
    });
    console.error(err);
    next(err);
  }
}

/**
 * This function createNotification() is used to create a new notification in the database by calling the createNotification() function from the notifications.model.js file.
 * @param {*} req The request object containing the parameters of the notification to create from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createNotification(req, res, next) {
  console.log("createNotification called");
  try {
    let message = req.body.Message;
    let adminId = req.body.AdminId;
    let disasterzoneId = req.body.DisasterzoneId;

    const params = [message, adminId, disasterzoneId];
    const notification = await model.createNotification(params);
    console.log("Notification created:", notification);

    /*
    if (req.accepts("html")) {
      const referer = req.get("referer");
      if (referer && !referer.includes("/auth/register")) {
        res.redirect(referer);
      } else {
        res.redirect("/auth/login");
      }
    } else {
      res.json(user);
    }
    */
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification" });
    console.error(err);
    next(err);
  }
}

/**
 * This function createNotificationUser() is used to create a new notification user in the database by calling the createNotificationUser() function from the notifications.model.js file.
 * @param {*} req The request object containing the parameters of the notification user to create from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function createNotificationUser(req, res, next) {
  console.log("createNotificationUser called");
  try {
    let userId = req.body.UserId;
    let notificationId = req.body.NotificationId;

    const params = [userId, notificationId];
    const notificationUser = await model.createNotificationUser(params);
    console.log("Notification user created:", notificationUser);
    /*
    if (req.accepts("html")) {
      const referer = req.get("referer");
      if (referer && !referer.includes("/auth/register")) {
        res.redirect(referer);
      } else {
        res.redirect("/auth/login");
      }
    } else {
      res.json(user);
    }
    */
    res.json(notificationUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification user" });
    console.error(err);
    next(err);
  }
}

/**
 * This function updateNotificationById() is used to update a notification by its ID in the database by calling the updateNotificationById() function from the notifications.model.js file.
 * @param {*} req The request object containing the parameters of the notification to update from req.body & req.params
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function updateNotificationById(req, res, next) {
  console.log("updateNotificationById called");
  try {
    let notificationId = req.params.id || req.body.id;
    let message = req.body.Message;
    let adminId = req.body.AdminId;

    const tempNotification = await model.getNotificationById(notificationId);
    if (!message) {
      message = tempNotification.Message;
    }

    if (!adminId) {
      adminId = tempNotification.AdminId;
    }

    const params = [message, adminId, notificationId];
    const notification = await model.updateNotificationById(params);
    console.log("Notification updated:", notification);
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification" });
    console.error(err);
    next(err);
  }
}

/**
 * This function deleteNotificationById() is used to delete a notification by its ID in the database by calling the deleteNotificationById() function from the notifications.model.js file.
 * @param {*} req The request object containing the ID of the notification to delete from req.params or req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function deleteNotificationById(req, res, next) {
  console.log("deleteNotificationById called");
  try {
    const notificationId = req.params.id || req.body.id;
    const notification = await model.deleteNotificationById(notificationId);
    console.log("Notification deleted:", notification);
    /*
    if (req.accepts("html")) {
      const referer = req.get("referer");
      if (referer) {
        res.redirect(referer);
      } else {
        res.redirect("/");
      }
    } else {
      res.json(user);
    }
    */
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
    console.error(err);
    next(err);
  }
}

function isPointInCircle(userLat, userLng, centerLat, centerLng, radiusMiles) {
  const R = 3958.8; // Earth's radius in miles
  const rlat1 = userLat * (Math.PI / 180);
  const rlat2 = centerLat * (Math.PI / 180);
  const difflat = rlat2 - rlat1;
  const difflon = (centerLng - userLng) * (Math.PI / 180);

  const d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );

  return d <= radiusMiles;
}

/**
 * This function createNotificationAndBroadcast() is used to create a new notification in the database and broadcast it to all users in the disaster zone by calling the createNotification() function from the notifications.model.js file and emitting a socket event.
 * @param {*} req The request object containing the parameters of the notification to create from req.body
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
/* const createNotificationAndBroadcast = async (req, res, next) => {
  console.log("createNotificationAndBroadcast called");
  try {
    let notifmessage = req.body.Message;
    let adminId = req.body.AdminId;
    let disasterzoneId = req.body.DisasterzoneId;

    // Create notification
    const params = [notifmessage, adminId, disasterzoneId];
    const notification = await model.createNotification(params);
    console.log("Notification created:", notification);

    // Get all users in the disaster zone
    const notifUsers = await model.getAllNotifsUsersByDisasterIdWithUsers(
      disasterzoneId
    );
    console.log("Notification users fetched:", notifUsers);

    // Emit socket event
    io.emit("disaster-alert", {
      message: notifmessage,
    });

    // Send emails to all users in the disaster zone
    if (notifUsers && notifUsers.length > 0) {
      // Use a Set to prevent duplicate emails
      const processedEmails = new Set();

      notifUsers.forEach((user) => {
        if (user.Email && !processedEmails.has(user.Email)) {
          processedEmails.add(user.Email);

          const mailOptions = {
            from: process.env.OAUTH_EMAIL_USER,
            to: user.Email,
            subject: "Emergency Alert Notification (TEST)",
            html: `
              <h2>Emergency Alert</h2>
              <p><strong>Message:</strong> ${notifmessage}</p>
              <p>This is an automated emergency alert. Please take all necessary precautions.</p>
              <br>
              <p>Stay safe,</p>
              <p>Emergency Response Team</p>
            `,
          };

          // Send email
          sendEmailFunc(mailOptions);
          console.log(`Email notification sent to ${user.Email}`);
        }
      });
    }

    if (req.accepts("html")) {
      const referer = req.get("referer");
      if (referer) {
        res.redirect(referer);
      } else {
        res.redirect("/");
      }
    } else {
      res.json({
        success: true,
        notification: notification,
        message: "Notification created and broadcast",
        usersNotified: notifUsers ? notifUsers.length : 0,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to create notification",
      message: err.message,
    });
    console.error(err);
    next(err);
  }
}; */
async function createNotificationAndBroadcast(req, res, next) {
  console.log("createNotificationAndBroadcast called");
  try {
    const message = req.body.Message;
    const adminId = req.body.AdminId;
    const disasterzoneId = req.body.DisasterzoneId;

    // Get disaster zone details
    const disasterZone = await disasterZoneModel.getDisasterZoneById(
      disasterzoneId
    );
    console.log("Found disaster zone:", disasterZone);

    if (!disasterZone) {
      throw new Error("Disaster zone not found");
    }

    // Create notification entry
    const params = [message, adminId, disasterzoneId];
    const notification = await model.createNotification(params);
    console.log("Notification created:", notification);

    // Get all users
    const allUsers = await userModel.getAll();
    console.log(`Processing ${allUsers.length} users for notifications`);
    const affectedUsers = [];

    // Filter users who are within the disaster zone
    allUsers.forEach((user) => {
      if (user.Latitude && user.Longitude) {
        const isInZone = isPointInCircle(
          parseFloat(user.Latitude),
          parseFloat(user.Longitude),
          parseFloat(disasterZone.Latitude),
          parseFloat(disasterZone.Longitude),
          parseFloat(disasterZone.Radius)
        );

        console.log(`User ${user.id} location check:`, {
          userLat: user.Latitude,
          userLng: user.Longitude,
          isInZone: isInZone,
        });

        if (isInZone) {
          affectedUsers.push(user);
          // Create notification_users entry
          model
            .createNotificationUser([user.id, notification.id])
            .catch((err) =>
              console.error(
                `Failed to create notification user entry for user ${user.id}:`,
                err
              )
            );
        }
      } else {
        console.log(`User ${user.id} has no location data`);
      }
    });

    console.log(`Found ${affectedUsers.length} affected users`);

    // Emit socket event with disaster zone information
    if (io) {
      const socketData = {
        message: message,
        zoneId: disasterzoneId,
        zoneLat: parseFloat(disasterZone.Latitude),
        zoneLng: parseFloat(disasterZone.Longitude),
        zoneRadius: parseFloat(disasterZone.Radius),
        zoneName: disasterZone.Name,
      };

      console.log("Emitting disaster alert:", socketData);
      io.emit("disaster-alert", socketData);
    } else {
      console.warn(
        "Socket.io not initialized - no real-time notifications will be sent"
      );
    }

    // Send emails to affected users
    let emailsSent = 0;
    const processedEmails = new Set();
    for (const user of affectedUsers) {
      if (user.Email && !processedEmails.has(user.Email)) {
        processedEmails.add(user.Email);
        const mailOptions = {
          from: process.env.OAUTH_EMAIL_USER,
          to: user.Email,
          subject: "Emergency Alert Notification",
          html: `
            <h2>Emergency Alert (TEST FOR A PROJECT - NOT REAL!!! - IGNORE THIS EMAIL!!!)</h2>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Area:</strong> ${disasterZone.Name}</p>
            <p>This is an automated emergency alert as you are in an affected area. Please take all necessary precautions.</p>
            <p>THIS IS A TEST FOR A PROJECT - NOT A REAL ALERT!!!</p>
            <p>PLEASE IGNORE THIS EMAIL</p>
            <br>
            <p>Stay safe,</p>
            <p>Emergency Response Team</p>
          `,
        };

        try {
          await sendEmailFunc(mailOptions);
          emailsSent++;
          console.log(`Email sent to ${user.Email}`);
        } catch (error) {
          console.error(`Failed to send email to ${user.Email}:`, error);
        }
      }
    }

    // Send response
    if (req.accepts("html")) {
      req.flash("success", `Alert sent to ${affectedUsers.length} users`);
      return res.redirect("back");
    }

    return res.json({
      success: true,
      notification: notification,
      stats: {
        totalUsers: allUsers.length,
        affectedUsers: affectedUsers.length,
        emailsSent: emailsSent,
      },
      message: `Alert sent successfully to ${affectedUsers.length} users`,
    });
  } catch (err) {
    console.error("Error in createNotificationAndBroadcast:", err);

    if (req.accepts("html")) {
      req.flash("error", "Failed to send alert");
      return res.redirect("back");
    }

    return res.status(500).json({
      success: false,
      error: "Failed to create and broadcast notification",
      message: err.message,
    });
  }
}

module.exports = {
  setIo,
  getAllNotifs,
  getAllNotifsUsers,
  getAllNotifsByAdminId,
  getAllNotifsByNotifIdWithUsers,
  getAllNotifsByNotifIdWithUsersAndDisasterZone,
  getAllNotifsByDisasterId,
  getAllNotifsByDisasterIdWithUsersAndDisasterZone,
  createNotification,
  createNotificationUser,
  updateNotificationById,
  deleteNotificationById,
  createNotificationAndBroadcast,
};
