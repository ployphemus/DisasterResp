/**
 * This is the main file that we are going to use to run our application.
 */
"use strict";

/*
 * This is the middleware that is required for the application to run.
 */
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");

const http = require("http");
const socketIo = require("socket.io");

const path = require("path");
const multer = require("multer");
const flash = require("connect-flash");
const { router: databaseRouter } = require("./models/database");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

// const upload = multer;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
const authMiddleware = require("./auth/auth.middleware");
const authRouter = require("./auth/auth.route");
const userRouter = require("./routes/user.route");
const shelterRouter = require("./routes/shelter.route");
const disasterRouter = require("./routes/disaster.route");
const disasterZoneRouter = require("./routes/disasterzone.route");
const notificationsRouter = require("./routes/notifications.route");
const notificationsController = require("./controllers/notifications.controller");

notificationsController.setIo(io);

//
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

/*
 * Routes
 */
app.use("/database", databaseRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/shelters", shelterRouter);
app.use("/disasters", disasterRouter);
app.use("/disasterzone", disasterZoneRouter);
app.use("/notifications", notificationsRouter);

app.get("/", (req, res) => {
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

  if (user_type == "ADMIN") {
    res.redirect("/users/admin/dashboard");
  } else {
    res.render("index", {
      loggedIn: req.loggedIn,
      user_type: req.user_type,
      user_id: req.user_id,
    });
  }
});

const nodeEmailMidd = require("./middleware/nodemailer");
//nodeEmailMidd.sendEmailFunc();

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log("App listening at http://localhost:" + PORT);
});

module.exports = { io };
