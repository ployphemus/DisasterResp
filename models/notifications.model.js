/**
 * This module contains functions for interacting with the notifications and notifications_users table in the database.
 * @module models/notifications.model
 * @file This file contains functions for interacting with the notifications and notifications_users table in the database.
 */
"use strict";
const db = require("./database");

/**
 * This function getAllNotifs() fetches all notifications from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all notifications in the database
 */
async function getAllNotifs() {
  const sql = "SELECT * FROM notifications";
  try {
    const notifications = await db.all(sql);
    return notifications;
  } catch (err) {
    console.error("Error fetching notifications:", err);
    throw err;
  }
}

/**
 * This function getAllNotifsUsers() fetches all notifications_users from the database.
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all notifications_users in the database
 */
async function getAllNotifsUsers() {
  const sql = "SELECT * FROM notification_users";
  try {
    const notificationUsers = await db.all(sql);
    return notificationUsers;
  } catch (err) {
    console.error("Error fetching notification users:", err);
    throw err;
  }
}

/**
 * This function getAllNotifsByAdminId() fetches all notifications by admin ID from the database.
 * @param {*} id The ID of the admin to fetch notifications
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all notifications for the admin with the given ID
 */
async function getAllNotifsByAdminId(id) {
  const sql = "SELECT * FROM notifications WHERE admin_id = ?";
  try {
    const notifications = await db.all(sql, [id]);
    return notifications;
  } catch (err) {
    console.error("Error fetching notifications by admin ID:", err);
    throw err;
  }
}

/**
 * This getAllNotifsByNotifIdWithUsers() fetches all notifications and its users by the notification ID from the database.
 * @param {*} id The ID of the notification to fetch
 * @return {Promise<Array>} Returns a promise that resolves to an array of all notifications and its users for the notification with the given ID
 */
async function getAllNotifsByNotifIdWithUsers(id) {
  const sql = `
    SELECT 
      n.id AS notification_id,
      n.Message,
      n.admin_id,
      n.disasterzone_id,
      nu.user_id
    FROM notifications n
    JOIN notification_users nu ON n.disasterzone_id = nu.notif_zone_id
    WHERE n.id = ?
  `;
  try {
    const notification = await db.all(sql, [id]);
    return notification;
  } catch (err) {
    console.error("Error fetching notification by ID:", err);
    throw err;
  }
}

/**
 * This function getAllNotifsByNotifIdWithUsersAndDisasterZone() fetches all notifications, its users, and the disaster zone by the notification ID from the database.
 * @param {*} id The ID of the notification to fetch
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all notifications, its users, and the disaster zone for the notification with the given ID
 */
async function getAllNotifsByNotifIdWithUsersAndDisasterZone(id) {
  const sql = `
        SELECT 
        n.id AS notification_id,
        n.Message,
        n.admin_id,
        n.disasterzone_id,
        dz.Name AS disasterzone_name,
        dz.Radius AS disasterzone_radius,
        nu.user_id
        FROM notifications n
        JOIN notification_users nu ON n.disasterzone_id = nu.notif_zone_id
        JOIN disasterzones dz ON n.disasterzone_id = dz.id
        WHERE n.id = ?
    `;
  try {
    const notification = await db.all(sql, [id]);
    return notification;
  } catch (err) {
    console.error("Error fetching notification by ID:", err);
    throw err;
  }
}

/**
 * This function getAllNotifsByDisasterId() fetches all notifications by disasterzone ID from the database.
 * @param {*} id The ID of the disasterzone to fetch notifications
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all notifications for the disasterzone with the given ID
 */
async function getAllNotifsByDisasterId(id) {
  const sql = "SELECT * FROM notifications WHERE disasterzone_id = ?";
  try {
    const notifications = await db.all(sql, [id]);
    return notifications;
  } catch (err) {
    console.error("Error fetching notifications by disasterzone ID:", err);
    throw err;
  }
}

/**
 * This function getAllNotifsByDisasterIdWithUsersAndDisasterZone() fetches all notifications, its users, and the disaster zone by the disasterzone ID from the database.
 * @param {*} id The ID of the disasterzone to fetch notifications
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all notifications, its users, and the disaster zone for the disasterzone with the given ID
 */
async function getAllNotifsByDisasterIdWithUsersAndDisasterZone(id) {
  const sql = `
        SELECT 
        n.id AS notification_id,
        n.Message,
        n.admin_id,
        n.disasterzone_id,
        dz.Name AS disasterzone_name,
        dz.Radius AS disasterzone_radius,
        nu.user_id
        FROM notifications n
        JOIN notification_users nu ON n.disasterzone_id = nu.notif_zone_id
        JOIN disasterzones dz ON n.disasterzone_id = dz.id
        WHERE n.disasterzone_id = ?
    `;
  try {
    const notification = await db.all(sql, [id]);
    return notification;
  } catch (err) {
    console.error("Error fetching notification by disasterzone ID:", err);
    throw err;
  }
}

/**
 * This function getAllNotifsUsersByDisasterId() fetches all notification users by disasterzone ID from the database
 * @param {*} id The ID of the disasterzone to fetch notification users
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all notification users for the disasterzone with the given ID
 */
async function getAllNotifsUsersByDisasterId(id) {
  const sql = "SELECT * FROM notification_users WHERE notif_zone_id = ?";
  try {
    const notificationUsers = await db.all(sql, [id]);
    return notificationUsers;
  } catch (err) {
    console.error("Error fetching notification users by disasterzone ID:", err);
    throw err;
  }
}

/**
 * This function getAllNotifsUsersByDisasterIdWithUsers() fetches all notification users by disasterzone ID from the database with user information
 * @param {*} id The ID of the disasterzone to fetch notification users
 * @returns {Promise<Array>} Returns a promise that resolves to an array of all notification users for the disasterzone with the given ID with user information
 */
async function getAllNotifsUsersByDisasterIdWithUsers(id) {
  const sql = `
    SELECT 
      nu.notif_zone_id,
      nu.user_id,
      u.First_Name,
      u.Last_Name,
      u.Email
    FROM notification_users nu
    JOIN users u ON nu.user_id = u.id
    WHERE nu.notif_zone_id = ?
  `;
  try {
    const notificationUsers = await db.all(sql, [id]);
    return notificationUsers;
  } catch (err) {
    console.error("Error fetching notification users by disasterzone ID:", err);
    throw err;
  }
}

/**
 * This function createNotification() creates a new notification in the database.
 * @param {*} params The parameters of the notification to create
 * @returns {Promise<Object>} Returns a promise that resolves to the notification that was created
 */
async function createNotification(params) {
  const sql =
    "INSERT INTO notifications (Message, admin_id, disasterzone_id) VALUES (?, ?, ?);";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error creating notification:", err);
    throw err;
  }
}

/**
 * This function createNotificationUser() creates a new notification user in the database.
 * @param {*} params The parameters of the notification user to create
 * @returns {Promise<Object>} Returns a promise that resolves to the notification user that was created
 */
async function createNotificationUser(params) {
  const sql =
    "INSERT INTO notification_users (notif_zone_id, user_id) VALUES (?, ?);";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error creating notification user:", err);
    throw err;
  }
}

/**
 * This function updateNotificationById() updates a notification in the database by its ID.
 * @param {*} params The parameters of the notification to update
 * @returns {Promise<Object>} Returns a promise that resolves to the notification that was updated
 */
async function updateNotificationById(params) {
  const sql = "UPDATE notifications SET Message = ?, admin_id = ? WHERE id = ?";
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error("Error updating notification:", err);
    throw err;
  }
}

/**
 * This function deleteNotificationById() deletes a notification from the database by its ID.
 * @param {*} id The ID of the notification to delete
 * @returns {Promise<Object>} Returns a promise that resolves to the notification that was deleted
 */
async function deleteNotificationById(id) {
  const sql = "DELETE FROM notifications WHERE id = ?";
  try {
    const result = await db.run(sql, [id]);
    return result;
  } catch (err) {
    console.error("Error deleting notification:", err);
    throw err;
  }
}

module.exports = {
  getAllNotifs,
  getAllNotifsUsers,
  getAllNotifsByAdminId,
  getAllNotifsByNotifIdWithUsers,
  getAllNotifsByNotifIdWithUsersAndDisasterZone,
  getAllNotifsByDisasterId,
  getAllNotifsByDisasterIdWithUsersAndDisasterZone,
  getAllNotifsUsersByDisasterId,
  getAllNotifsUsersByDisasterIdWithUsers,
  createNotification,
  createNotificationUser,
  updateNotificationById,
  deleteNotificationById,
};
