"use strict";
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Ensure the 'db' directory exists one level up from the current directory
const dbDir = path.join(__dirname, "..", "db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

const dbPath = path.join(dbDir, "database.db");

// Create a new database instance or open it if it exists
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database: " + err.message);
  } else {
    console.log("Database path:", dbPath);
    console.log("Connected to the SQLite database.");

    // Enable foreign keys
    db.run("PRAGMA foreign_keys = ON;", (err) => {
      if (err) {
        console.error("Error enabling foreign keys:", err.message);
      } else {
        console.log("Foreign key constraints enabled");
      }
    });

    // Automatically create the users table if it doesn't exist
    const createUsersTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            First_Name TEXT,
            Last_Name TEXT,
            Password TEXT NOT NULL,
            Latitude REAL,
            Longitude REAL,
            Email TEXT NOT NULL UNIQUE,
            userType TEXT DEFAULT 'USER',
            resetToken TEXT,
            resetTokenExpiration TEXT
        )`;

    db.run(createUsersTableSql, (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      } else {
        console.log("Users table created or already exists");
      }
    });

    // Automatically create the shelters table if it doesn't exist
    const createSheltersTableSql = `
      CREATE TABLE IF NOT EXISTS shelters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT,
        Latitude REAL,
        Longitude REAL,
        Shelter_address TEXT,
        Maximum_Capacity INTEGER,
        Current_Capacity INTEGER,
        disasterzone_id INTEGER,
        FOREIGN KEY (disasterzone_id) 
          REFERENCES disasterzones(id) 
          ON DELETE CASCADE
      );
      
      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_shelters_disasterzone 
      ON shelters(disasterzone_id);`;

    db.run(createSheltersTableSql, (err) => {
      if (err) {
        console.error("Error creating shelters table:", err.message);
      } else {
        console.log("Shelters table created or already exists");
      }
    });
  }
});

const database = express.Router();

// Create users table
database.get("/createusers", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        First_Name TEXT,
        Last_Name TEXT,
        Password TEXT NOT NULL,
        Latitude REAL,
        Longitude REAL,
        Email TEXT NOT NULL UNIQUE,
        userType TEXT DEFAULT 'USER',
        resetToken TEXT,
        resetTokenExpiration TEXT
    )`;

  db.run(createTableSql, (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
      return res.status(500).send("Error creating users table");
    }
    console.log("Users table created or already exists");
    res.send("Users table created");
  });
});

// Add user
database.post("/registeruser", (req, res) => {
  // Changed to POST for adding a user
  let user = {
    First_Name: req.body.First_Name || "first",
    Last_Name: req.body.Last_Name || "last",
    Password: req.body.Password || "password",
  };

  // Use parameterized queries to prevent SQL injection
  let sql = `INSERT INTO users (First_Name, Last_Name, Password) VALUES (?, ?, ?)`;

  db.run(sql, [user.First_Name, user.Last_Name, user.Password], function (err) {
    if (err) {
      console.error("Error adding user:", err.message);
      return res.status(500).send("Error adding user");
    }
    console.log(`User added with ID: ${this.lastID}`);
    res.send("User added");
  });
});

// Select user entry
database.get("/user/:id", (req, res) => {
  let sql = `SELECT * FROM users WHERE id = ?`; // Changed to use parameterized query
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      console.error("Error fetching user:", err.message);
      return res.status(500).send("Error fetching user");
    }
    res.json(row); // Send the user data as JSON
  });
});

// Update user location
database.put("/updateuserlocation/:id", (req, res) => {
  // Changed to PUT
  let userId = req.params.id;
  let newLatitude = req.body.Latitude;
  let newLongitude = req.body.Longitude;
  let sql = "UPDATE users SET Latitude = ?, Longitude = ? WHERE id = ?";
  db.run(sql, [newLatitude, newLongitude, userId], (err) => {
    if (err) {
      console.error("Error updating user location:", err.message);
      return res.status(500).send("Error updating user location");
    }
    res.send("Location updated");
  });
});

// Update user details
database.put("/updateuser/:id", (req, res) => {
  // Changed to PUT
  const userId = req.params.id;
  const {
    First_Name,
    Last_Name,
    Password,
    Latitude,
    Longitude,
    Email,
    userType,
  } = req.body;

  let updateFields = [];
  let updateValues = [];

  if (First_Name) {
    updateFields.push("First_Name = ?");
    updateValues.push(First_Name);
  }
  if (Last_Name) {
    updateFields.push("Last_Name = ?");
    updateValues.push(Last_Name);
  }
  if (Password) {
    updateFields.push("Password = ?");
    updateValues.push(Password);
  }
  if (Latitude) {
    updateFields.push("Latitude = ?");
    updateValues.push(Latitude);
  }
  if (Longitude) {
    updateFields.push("Longitude = ?");
    updateValues.push(Longitude);
  }
  if (Email) {
    updateFields.push("Email = ?");
    updateValues.push(Email);
  }
  if (userType) {
    updateFields.push("userType = ?");
    updateValues.push(userType);
  }

  // If no fields to update, return an error
  if (updateFields.length === 0) {
    return res.status(400).send("No fields provided for update.");
  }

  updateValues.push(userId); // Add userId to the values array for WHERE clause

  let updateQuery = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

  db.run(updateQuery, updateValues, (err) => {
    if (err) {
      console.error("Error updating user:", err.message);
      return res.status(500).send("Error updating user");
    }
    res.send(`User updated successfully`);
  });
});

// Remove a user
database.delete("/removeuser/:id", (req, res) => {
  let userID = req.params.id;
  let deleteUserSql = `DELETE FROM users WHERE id = ?`;

  db.run(deleteUserSql, [userID], (err) => {
    if (err) {
      console.error("Error removing user:", err.message);
      return res.status(500).send("Error removing user");
    }
    res.send(`User with ID ${userID} removed`);
  });
});

// Add shelter
database.post("/addshelter", (req, res) => {
  let shelter = {
    Name: req.body.Name || "name",
    Maximum_Capacity: req.body.Maximum_Capacity || 5000,
  };
  let sql = "INSERT INTO shelters (Name, Maximum_Capacity) VALUES (?, ?)";
  db.run(sql, [shelter.Name, shelter.Maximum_Capacity], (err) => {
    if (err) {
      console.error("Error adding shelter:", err.message);
      return res.status(500).send("Error adding shelter");
    }
    res.send("Shelter added");
  });
});

// Update shelter capacity
database.put("/updateshelter/:id", (req, res) => {
  // Changed to PUT
  let shelterId = req.params.id;
  let newCapacity = req.body.Current_Capacity; // Updated to use body for capacity
  let sql = "UPDATE shelters SET Current_Capacity = ? WHERE id = ?";
  db.run(sql, [newCapacity, shelterId], (err) => {
    if (err) {
      console.error("Error updating shelter capacity:", err.message);
      return res.status(500).send("Error updating shelter capacity");
    }
    res.send("Shelter capacity updated");
  });
});

// Create disaster zones table
database.get("/createzones", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS disasterzones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT,
        Latitude REAL,
        Longitude REAL,
        Radius REAL,
        HexColor TEXT
    )`;
  db.run(createTableSql, (err) => {
    if (err) {
      console.error("Error creating disaster zones table:", err.message);
      return res.status(500).send("Error creating disaster zones table");
    }
    res.send("Zones table created");
  });
});

// Create notifications table
database.get("/createnotifications", (req, res) => {
  let createNotificationsTableSql = `CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Message TEXT,
        admin_id INTEGER,
        disasterzone_id INTEGER,
        FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (disasterzone_id) REFERENCES disasterzones(id) ON DELETE CASCADE
    )`;

  let createNotificationUsersTableSql = `CREATE TABLE IF NOT EXISTS notification_users (
        notif_zone_id INTEGER,
        user_id INTEGER,
        PRIMARY KEY (notif_zone_id, user_id),
        FOREIGN KEY (notif_zone_id) REFERENCES disasterzones(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;

  db.run(createNotificationsTableSql, (err) => {
    if (err) {
      console.error("Error creating notifications table:", err.message);
      return res.status(500).send("Error creating notifications table");
    }

    db.run(createNotificationUsersTableSql, (err) => {
      if (err) {
        console.error("Error creating notification_users table:", err.message);
        return res.status(500).send("Error creating notification_users table");
      }
      res.send("Notifications and Notification_Users tables created");
    });
  });
});

// Function for executing queries
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

// Function for executing a query that returns a single row
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve(row);
    });
  });
}

// Function for executing queries that do not return any rows
/* function run1(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve();
    });
  });
} */

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      // Note: using regular function to access 'this'
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
}

module.exports = {
  router: database,
  all,
  get,
  run,
};
