"use strict";
const clientID = process.env.OAUTH_EMAIL_CLIENT_ID;
const clientSecret = process.env.OAUTH_EMAIL_CLIENT_SECRET;
const clientRefreshToken = process.env.OAUTH_EMAIL_REFRESH_TOKEN;
const clientAccessToken = process.env.OAUTH_EMAIL_ACCESS_TOKEN;
const clientAppPassword = process.env.OAUTH_EMAIL_APP_PASSWORD;
const clientEmailUser = process.env.OAUTH_EMAIL_USER;
const nodemailer = require("nodemailer");

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

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

let mailOptions = {
  from: clientEmailUser,
  to: "j_moreno@uncg.edu",
  subject: "Test Email",
  text: "Testing email",
};

/* transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
}); */

function sendEmailFunc() {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = { sendEmailFunc };
