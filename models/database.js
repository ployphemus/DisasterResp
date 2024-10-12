"use strict";
const express = require("express");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // insert your own password for your sql
  database: "nodemysql",
});

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected");
});

const database = express.Router();

// Create DB
database.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE IF NOT EXISTS nodemysql";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database created");
  });
});

// Create users table
database.get("/createusers", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT,
        First_Name VARCHAR(255),
        Last_Name VARCHAR(255),
        Password VARCHAR(255) NOT NULL,
        Latitude DECIMAL(9,6),
        Longitude DECIMAL(9,6),
        Email VARCHAR(255) NOT NULL UNIQUE,
        userType ENUM('USER', 'ADMIN') DEFAULT 'USER',
        resetToken VARCHAR(255),
        resetTokenExpiration TIMESTAMP,
        PRIMARY KEY (id)
    )`;

  db.query(createTableSql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Users table created");
  });
});

// Add user
database.get("/registeruser", (req, res) => {
  let user = {
    First_Name: "first",
    Last_Name: "last",
    Password: "password",
  };
  let sql = "INSERT INTO users SET ?";
  let query = db.query(sql, user, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("User added");
  });
});

// Select user entry
database.get("/user/:id", (req, res) => {
  let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("User selected");
  });
});

// Update user location
database.get("/updateuserlocation/:id", (req, res) => {
  let userId = req.params.id;
  let newLatitude = 1.2;
  let newLongitude = -5.823;
  let sql = "UPDATE users SET Latitude = ?, Longitude = ? WHERE id = ?";
  db.query(sql, [newLatitude, newLongitude, userId], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Location updated");
  });
});

// Update user details
database.post("/updateuser/:id", (req, res) => {
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

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) throw err;
    res.send(`User updated successfully`);
  });
});

// Remove a user
database.delete("/removeuser/:id", (req, res) => {
  let userID = req.params.id;
  let deleteTornadoSql = `DELETE FROM users WHERE id = ?`;

  db.query(deleteTornadoSql, [userID], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(`Tornado entry with ID ${userID} removed`);
  });
});

// Create shelters table
database.get("/createshelters", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS shelters (
        id INT AUTO_INCREMENT,
        Name VARCHAR(255),
        Latitude decimal(9,6),
        Longitude decimal(9,6),
        Shelter_address VARCHAR(255),
        Maximum_Capacity int,
        Current_Capacity int,
        disasterzone_id int,
        PRIMARY KEY (id),
        FOREIGN KEY (disasterzone_id) REFERENCES disasterzones(id) ON DELETE CASCADE
    )`;
  db.query(createTableSql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Shelters table created");
  });
});

// Add shelter
database.get("/addshelter", (req, res) => {
  let shelter = { Name: "name", Maximum_Capacity: 5000 };
  let sql = "INSERT INTO shelters SET ?";
  let query = db.query(sql, shelter, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Shelter added");
  });
});

// Update shelter capacity
database.get("/updateshelter/:id", (req, res) => {
  let shelterId = req.params.id;
  let newCapacity = 50;
  let sql = "UPDATE shelters SET Current_Capacity = ? WHERE id = ?";
  db.query(sql, [newCapacity, shelterId], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Shelter capacity updated");
  });
});

// Hurricane table
database.get("/createhurricanes", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS hurricanes (
        id INT AUTO_INCREMENT,
        Name VARCHAR(255),
        Category ENUM('1', '2', '3', '4', '5'),
        Date DATE,
        Latitude decimal(9,6),
        Longitude decimal(9,6),
        Wind decimal(5,2),
        PRIMARY KEY (id)
    )`;
  db.query(createTableSql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Hurricanes table created");
  });
});

// Update hurricane
database.get("/updatehurricane/:id", (req, res) => {
  let hurricaneID = req.params.id;
  let newLatitude = 1.2;
  let newLongitude = -5.823;
  let newWind = 100.34;
  let sql =
    "UPDATE hurricanes SET Latitude = ?, Longitude = ?, Wind = ? WHERE id = ?";
  db.query(
    sql,
    [newLatitude, newLongitude, newWind, hurricaneID],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Hurricane updated");
    }
  );
});

// Remove a hurricane
database.delete("/removehurricane/:id", (req, res) => {
  let hurricaneID = req.params.id;
  let deleteTornadoSql = `DELETE FROM hurricanes WHERE id = ?`;

  db.query(deleteTornadoSql, [hurricaneID], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(`Hurricane entry with ID ${hurricaneID} removed`);
  });
});

// Flood table
database.get("/createfloods", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS floods (
        id INT AUTO_INCREMENT,
        Latitude decimal(9,6),
        Longitude decimal(9,6),
        Water_Level decimal(5,2),
        Date DATE,
        PRIMARY KEY (id)
    )`;
  db.query(createTableSql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Floods table created");
  });
});

// Update flood
database.get("/updateflood/:id", (req, res) => {
  let floodID = req.params.id;
  let newLatitude = 1.2;
  let newLongitude = -5.823;
  let newWaterLevel = 20;
  let sql =
    "UPDATE floods SET Latitude = ?, Longitude = ?, Water_Level = ? WHERE id = ?";
  db.query(
    sql,
    [newLatitude, newLongitude, newWaterLevel, floodID],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Flood updated");
    }
  );
});

// Remove a flood
database.delete("/removeflood/:id", (req, res) => {
  let floodID = req.params.id;
  let sql = `DELETE FROM floods WHERE id = ?`;

  db.query(sql, [floodID], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(`Flood entry with ID ${floodID} removed`);
  });
});

// Fires table
database.get("/createfires", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS fires (
        id INT AUTO_INCREMENT,
        Latitude decimal(9,6),
        Longitude decimal(9,6),
        Temperature decimal(6,2),
        Date DATE,
        PRIMARY KEY (id)
    )`;
  db.query(createTableSql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Fires table created");
  });
});

// Update fire
database.get("/updateflood/:id", (req, res) => {
  let fireID = req.params.id;
  let newLatitude = 1.2;
  let newLongitude = -5.823;
  let newTemperature = 1200.69;
  let sql =
    "UPDATE fires SET Latitude = ?, Longitude = ?, Temperature = ? WHERE id = ?";
  db.query(
    sql,
    [newLatitude, newLongitude, newTemperature, fireID],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Fire updated");
    }
  );
});

// Remove a fire
database.delete("/removefire/:id", (req, res) => {
  let fireID = req.params.id;
  let sql = `DELETE FROM fires WHERE id = ?`;

  db.query(sql, [fireID], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(`Fire entry with ID ${fireID} removed`);
  });
});

// Tornadoes table
database.get("/createtornadoes", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS tornadoes (
        id INT AUTO_INCREMENT,
        Latitude decimal(9,6),
        Longitude decimal(9,6),
        Wind decimal(5,2),
        Category ENUM('EF0','EF1', 'EF2', 'EF3', 'EF4', 'EF5'),
        Date DATE,
        PRIMARY KEY (id)
    )`;
  db.query(createTableSql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Fires table created");
  });
});

// Update tornado
database.get("/updatetornado/:id", (req, res) => {
  let tornadoID = req.params.id;
  let newLatitude = 1.2;
  let newLongitude = -5.823;
  let newWind = 250.32;
  let sql =
    "UPDATE tornadoes SET Latitude = ?, Longitude = ?, Wind = ? WHERE id = ?";
  db.query(
    sql,
    [newLatitude, newLongitude, newWind, tornadoID],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Tornado updated");
    }
  );
});

// Remove a tornado
database.delete("/removetornado/:id", (req, res) => {
  let tornadoID = req.params.id;
  let sql = `DELETE FROM tornado WHERE id = ?`;

  db.query(sql, [tornadoID], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(`Tornado entry with ID ${tornadoID} removed`);
  });
});

// Earthquakes table
database.get("/createearthquakes", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS earthquakes (
        id INT AUTO_INCREMENT,
        Latitude decimal(9,6),
        Longitude decimal(9,6),
        Magnitude decimal(4,2),
        Date DATE,
        PRIMARY KEY (id)
    )`;
  db.query(createTableSql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Earthquakes table created");
  });
});

// Remove an earthquake
database.delete("/removeearthquake/:id", (req, res) => {
  let earthquakeID = req.params.id;
  let sql = `DELETE FROM earthquakes WHERE id = ?`;

  db.query(sql, [earthquakeID], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(`Eartquake entry with ID ${earthquakeID} removed`);
  });
});

// Landslides table
database.get("/createlandslides", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS landslides (
        id INT AUTO_INCREMENT,
        Latitude decimal(9,6),
        Longitude decimal(9,6),
        Date DATE,
        PRIMARY KEY (id)
    )`;
  db.query(createTableSql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Landslides table created");
  });
});

// Remove a landslide
database.delete("/removelandslide/:id", (req, res) => {
  let landslideID = req.params.id;
  let sql = `DELETE FROM landslides WHERE id = ?`;

  db.query(sql, [landslideID], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(`Landslide entry with ID ${landslideID} removed`);
  });
});

/**
 * Database for zones/areas
 */
database.get("/createzones", (req, res) => {
  let createTableSql = `CREATE TABLE IF NOT EXISTS disasterzones (
        id INT AUTO_INCREMENT,
        Name VARCHAR(255),
        Latitude decimal(9,6),
        Longitude decimal(9,6),
        Radius decimal(9,6),
        HexColor VARCHAR(255),
        PRIMARY KEY (id)
    )`;
  db.query(createTableSql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Zones table created");
  });
});

/**
 * This part of the code allows for the models to simply call the database functions to execute queries.
 */

/**
 * This function all() is used to execute a query that returns multiple rows.
 * @param {*} sql The SQL query to execute
 * @param {*} params The parameters to pass to the query
 * @returns A promise that resolves to the results of the query
 */
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

/**
 * This function get() is used to execute a query that returns a single row.
 * @param {*} sql The SQL query to execute
 * @param {*} params The parameters to pass to the query
 * @returns A promise that resolves to the first row of the query results
 */
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve(results[0]);
    });
  });
}

/**
 * This function run() is used to execute a query that does not return any rows.
 * @param {*} sql The SQL query to execute
 * @param {*} params The parameters to pass to the query
 * @returns A promise that resolves to the results of the query
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = {
  router: database,
  all,
  get,
  run,
};
