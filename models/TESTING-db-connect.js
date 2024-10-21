"use strict";
/**
 * This is an testing version of the database connection file that I created to see if I could get the database to connect. -JM
 */
const mySql = require("mysql");

const connectDB = mySql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "disasterresp",
});

connectDB.getConnection((err, connection) => {
  if (err) {
    console.log("Error connecting to database");
  } else {
    console.log("Connected to database as id " + connection.threadId);
  }
});

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    connectDB.run(sql, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    connectDB.run(sql, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve(results[0]);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    connectDB.run(sql, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = {
  all,
  get,
  run,
};
