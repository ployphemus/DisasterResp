/**
 * This file contains the middleware functions that can be used by auth routes.
 * @module auth/auth.middleware
 * @file This file contains the middleware functions that can be used by auth routes.
 */
"use strict";

/**
 * This function isAdmin() checks if the user is an admin or not.
 * @param {*} req The request object containing the paramaters of the user to check if they are an admin or not
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
function isAdmin(req, res, next) {
  if (req.user && req.user.userType === "ADMIN") {
    next();
  } else {
    res.status(403).send("Only admins can access this route");
  }
}

/**
 * This function isMatchingUserOrAdmin() checks if the user is an admin or the user is the same as the user in the request.
 * @param {*} req The request object containing the user information
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
function isMatchingUserOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(403).send("Only admins or the user can access this");
  }

  // Convert session ID to string
  const userIdFromSession = String(req.user.id);

  // Check both params and body for user ID
  const userIdFromParams = req.params.id ? String(req.params.id) : null;
  const userIdFromBody = req.body.user_id ? String(req.body.user_id) : null;

  if (
    req.user.userType === "ADMIN" ||
    userIdFromSession === userIdFromParams ||
    userIdFromSession === userIdFromBody
  ) {
    next();
  } else {
    console.log("Session user ID:", userIdFromSession);
    console.log("Params user ID:", userIdFromParams);
    console.log("Body user ID:", userIdFromBody);
    res.status(403).send("Only admins or the user can access this route");
  }
}

/**
 * This function isMatchingUser() checks if the user is the same as the user in the request.
 * @param {*} req The request object containing the user information
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
function isMatchingUser(req, res, next) {
  if (!req.user) {
    return res.status(403).send("Only the user can access this");
  }

  // Convert both IDs to strings for comparison
  const userIdFromSession = String(req.user.id);
  const userIdFromParams = String(req.params.id);

  if (userIdFromSession === userIdFromParams) {
    next();
  } else {
    console.log("Session user ID:", userIdFromSession);
    console.log("Params user ID:", userIdFromParams);
    res.status(403).send("Only the user can access this route");
  }
}

/**
 * This function extractUserInfo() extracts the user information from the request object and adds it to the response object.
 * @param {*} req The request object containing the user information
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
function extractUserInfo(req, res, next) {
  //console.log("Called extractUserInfo");
  req.loggedIn = req.user ? true : false;
  req.user_type = req.user ? req.user.userType : null;
  req.user_id = req.user ? req.user.id : null;
  next();
}

module.exports = {
  isAdmin,
  isMatchingUserOrAdmin,
  isMatchingUser,
  extractUserInfo,
};
