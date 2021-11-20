const express = require('express');
const router = express.Router();
const path = require('path');
// Get the connection pool from the connection module
const pool = require('../database-data/connection');

// test route landing page
router.get('/', function (req, res) {
    res.send(`<p><a href="/test/testCharacters">testCharacter</a></p>`);
});


// __dirname is set to the routes directory
router.get('/testCharacterEntry', function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/testCharacterEntry.html`));
});
router.get('/viewCharacters', function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/viewCharacters.html`));
});


// Recieve data from test entry pages
router.post('/entryResponse/:tableName', function (req, res) {
    let sql = '';
    let firstLoop = true;
    let input = req.body;

    // Convert the form data into an sql query
    sql = `INSERT INTO rpg_project_db.${req.params.tableName} (`;
    for (let field in input) {
        if (!firstLoop) sql += ',';
        sql += `${field}`;
        firstLoop = false;
    }
    sql += `) VALUES (`;
    firstLoop = true;
    for (let field in input) {
        if (!firstLoop) sql += ',';
        sql += `'${input[field]}'`;
        firstLoop = false;
    }
    sql += `);`;

    // Get a connection from the pool and run the query
    pool.query(sql, function (err) {
        if (err) throw err;
        console.log(`${req.params.tableName} updated`);
    });

    console.log(sql);
    console.log(input);
    res.redirect(`/test/table/characters`);
});

router.get(`/testRedirect`, function (req, res) {
    res.redirect(`/test/table/characters`);
});

router.get('/table/:tableName', function (req, res) {
    let sql = '';
    
    // Get all data from the characters table
    sql = `SELECT * FROM rpg_project_db.${req.params.tableName}`;
    // Get a connection from the pool and run the query
    pool.query(sql, function (err, result) {
        if (err) throw err;

        console.log(result);
        res.json(result);
    });

});

module.exports = router;