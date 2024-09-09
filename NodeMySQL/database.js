const express = require('express');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'nodemysql'
});

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected');
});

const database = express();

// Create DB
database.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE IF NOT EXISTS nodemysql';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Database created');
    });
});

// Create users table
database.get('/createusers', (req, res) => {
    let createTableSql = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT,
        First_Name VARCHAR(255),
        Last_Name VARCHAR(255),
        Phone_Number bigint,
        Password VARCHAR(255),
        Latitude decimal(9,6),
        Longitude decimal(9,6),
        PRIMARY KEY (id)
    )`;
    db.query(createTableSql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Users table created');
    });
});

// Add user
database.get('/registeruser', (req, res) => {
    let user = { First_Name: 'first', Last_Name: 'last', Phone_Number: 7192871956, Password: 'password' };
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, user, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('User added');
    });
});

// Select user entry
database.get('/user/:id', (req, res) => {
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('User selected');
    });
})

// Update user location
database.get('/updateuser/:id', (req, res) => {
    let userId = req.params.id;
    let newLatitude = 1.2;
    let newLongitude = -5.823;
    let sql = 'UPDATE users SET Latitude = ?, Longitude = ? WHERE id = ?';
    db.query(sql, [newLatitude, newLongitude, userId], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Location updated');
    });
});


// Create shelters table
database.get('/createshelters', (req, res) => {
    let createTableSql = `CREATE TABLE IF NOT EXISTS shelters (
        id INT AUTO_INCREMENT,
        Name VARCHAR(255),
        Latitude decimal(9,6),
        Longitude decimal(9,6),
        Maximum_Capacity int,
        Current_Capacity int,
        PRIMARY KEY (id)
    )`;
    db.query(createTableSql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Shelters table created');
    });
});

// Add shelter
database.get('/addshelter', (req, res) => {
    let shelter = { Name: 'name', Maximum_Capacity: 5000};
    let sql = 'INSERT INTO shelters SET ?';
    let query = db.query(sql, shelter, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Shelter added');
    });
});

// Update shelter capacity
database.get('/updateshelter/:id', (req, res) => {
    let shelterId = req.params.id;
    let newCapacity = 50;
    let sql = 'UPDATE shelters SET Current_Capacity = ? WHERE id = ?';
    db.query(sql, [newCapacity, shelterId], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Shelter capacity updated');
    });
});

database.listen('8000', () => {
    console.log('Server started on port 8000');
});
