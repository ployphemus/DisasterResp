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

module.exports = {
  isAdmin,
};
