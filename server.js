/**
 * This is the main file that we are going to use to run our application.
 */
"use strict";

/*
 * This is the middleware that is required for the application to run.
 */
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const flash = require("connect-flash");
//const dbConnect = require("./models/db-connect");
const { router: databaseRouter } = require("./models/database");
// const upload = multer;
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
const userRouter = require("./routes/user.route");
const shelterRouter = require("./routes/shelter.route");

/*
 * Routes
 */
app.use("/database", databaseRouter);
app.use("/users", userRouter);
app.use("/shelters", shelterRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("App listening at http://localhost:" + PORT);
});
