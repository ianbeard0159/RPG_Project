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


// VEIW ALL ENTRIES -display page-
router.get('/view/:tableName', function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/view-${req.params.tableName}.html`));
});
// VIEW ALL ENTRIES -populate tables-
router.get('/table/:tableName', function (req, res) {
    let sql = '';
    
    // Get all data from the characters table
    sql = `SELECT * FROM rpg_project_db.${req.params.tableName}`;
    // Get a connection from the pool and run the query
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log(sql);
        res.json(result);
    });

});
// END VIEW ENTRIES


// DELETE ENTRY
router.get('/delete/:tableName/:id', function (req, res) {
    // Get the correct field name for the input ID
    let idType;
    switch(req.params.tableName) {
        case 'characters':
            idType = 'id_character';
            break;
        case 'enemys':
            idType = 'id_enemy';
            break;
        case 'supports':
            idType = 'id_support';
            break;
        case 'modifiers':
            idType = 'id_modifier';
            break;
        default:
            // Redirect back to form page if the id field isn't valid
            res.redirect(`/test/view/${req.params.tableName}`);
    }
    let sql = `DELETE FROM rpg_project_db.${req.params.tableName} WHERE ${idType} = ${req.params.id}`;

    // Get a connection from the pool and run the query
    pool.query(sql, function (err) {
        if (err) throw err;
        console.log(sql);
        console.log(`${req.params.tableName} updated`);
    });
    res.redirect(`/test/view/${req.params.tableName}`);
});
// END DELETE ENTRY

// CREATE ENTRY -form page-
router.get('/testCharacterEntry', function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/testCharacterEntry.html`));
});
// CREATE NEW ENTRY -recieve form data-
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
        console.log(sql);
        console.log(`${req.params.tableName} updated`);
    });
    res.redirect(`/test/view/characters`);
});
// END CREATE NEW ENTRY


// EDIT EXISTING ENTRY -form page-
router.get(`/edit/:tableName/:id`, function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/edit-${req.params.tableName}.html`));
});
// EDIT EXISTING ENTRY -populate form-
router.get('/viewEntry/:tableName/:id', function (req, res) {
    // Get the correct field name for the input ID
    let idType;
    switch(req.params.tableName) {
        case 'characters':
            idType = 'id_character';
            break;
        case 'enemys':
            idType = 'id_enemy';
            break;
        case 'supports':
            idType = 'id_support';
            break;
        case 'modifiers':
            idType = 'id_modifier';
            break;
        default:
            // Redirect back to form page if the id field isn't valid
            res.redirect(`/test/edit/${req.params.tableName}/${req.params.id}`);
    }

    // Generate SQL query
    let sql = '';
    sql = `SELECT * FROM rpg_project_db.${req.params.tableName} \
        WHERE ${idType} = ${req.params.id}`;

    // Get a connection from the pool and run the query
    pool.query(sql, function (err, result) {
        console.log(sql);
        if (err) throw err;
        res.json(result);
    });
});
// EDIT EXISTING ENTRY -recieve form data-
router.post('/editResponse/:tableName/:id', function (req, res) {
    // Get the correct field name for the input ID
    let idType;
    switch(req.params.tableName) {
        case 'characters':
            idType = 'id_character';
            break;
        case 'enemys':
            idType = 'id_enemy';
            break;
        case 'supports':
            idType = 'id_support';
            break;
        case 'modifiers':
            idType = 'id_modifier';
            break;
        default:
            // Redirect back to form page if the id field isn't valid
            res.redirect(`/test/edit/${req.params.tableName}/${req.params.id}`);
    }
    // Generate SQL query
    let sql = '';
    let firstLoop = true;
    let input = req.body;
    // Convert the form data into an sql query
    sql = `UPDATE rpg_project_db.${req.params.tableName} SET `;
    for (let field in input) {
        if (!firstLoop) sql += ',';
        sql += `${field} = '${input[field]}'`;
        firstLoop = false;
    }
    sql += ` WHERE ${idType} = '${req.params.id}'`;

    // Get a connection from the pool and run the query
    pool.query(sql, function (err) {
        if (err) throw err;
        console.log(sql);
        console.log(`${req.params.tableName} updated`);
    });
    res.redirect(`/test/view/characters`);

});
// END EXISTING ENTRY


module.exports = router;