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
//const bodyParser = require("body-parser");
//const dbConnect = require("./models/db-connect");
const { router: databaseRouter } = require("./models/database");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
// const upload = multer;

app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(bodyParser.json());
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
const authRouter = require("./auth/auth.route");
const userRouter = require("./routes/user.route");
const shelterRouter = require("./routes/shelter.route");
const disasterRouter = require("./routes/disaster.route");

//
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

/*
 * Routes
 */
app.use("/database", databaseRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/shelters", shelterRouter);
app.use("/disasters", disasterRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("App listening at http://localhost:" + PORT);
});
