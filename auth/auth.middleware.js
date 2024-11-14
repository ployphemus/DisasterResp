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
    res.status(403).send("Only admins or the user can access this");
  }

  if (
    req.user &&
    (req.user.userType === "ADMIN" || req.user.id === req.params.id)
  ) {
    next();
  } else {
    res.status(403).send("Only admins or the user can access this route");
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
  extractUserInfo,
};
