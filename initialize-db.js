const mysql = require('mysql');
const tables = require('./database-data/tables.json');
require('dotenv').config();

// Establish Database Connection
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

// Create Database
function create_db(name) {
    con.database = name;
    let sql = '';

    // Create the new database if it does not already exist
    sql = `CREATE DATABASE IF NOT EXISTS ${name}`;
    con.query(sql, function (err) {
        if (err) throw err;
        console.log(`Database '${name}' created or already exists`);
    });

    // Set the new database as the active one
    sql = `USE ${name}`;
    con.query(sql, function (err) {
        if (err) throw err;
        console.log(`Database '${name}' selected as active database`);
    });
}

// Create Table
function create_table(name, columns) {
    let sql = '';

    // Convert the input from 'columns' into an sql query format
    let columnString = '(';
    let firstLoop = true;
    for (let column in columns) {
        if(!firstLoop) {
            columnString += ', ';
        }
        columnString += columns[column];
        firstLoop = false;
    }
    columnString += ');';

    // Add the new table to the active database if it does not already exist
    sql = `CREATE TABLE IF NOT EXISTS ${name} ${columnString}`;
    con.query(sql, function (err) {
        if (err) throw err;
        console.log(`Table '${name}' created or already exists`)
    });
}

con.connect(function (err) {
    // Confirm that the connection has been established
    if (err) throw err;
    console.log('Successfuly Connected');

    // Initialize the database if it does not already exist
    create_db('rpg_project_db');
    for (let table in tables) {
        create_table(table, tables[table]);
    }

});
