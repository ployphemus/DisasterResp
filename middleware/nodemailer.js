"use strict";
const clientAppPassword = process.env.OAUTH_EMAIL_APP_PASSWORD;
const clientEmailUser = process.env.OAUTH_EMAIL_USER;
const nodemailer = require("nodemailer");

/**
 * This creates a transporter object that is used to send emails.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: clientEmailUser,
    pass: clientAppPassword,
  },
});

/**
 * This verifies the transporter object.
 */
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

/**
 * This function sendEmailFunc() sends an email.
 * @param {*} mailOptions The options for the email to send
 */
function sendEmailFunc(mailOptions) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = { sendEmailFunc };
