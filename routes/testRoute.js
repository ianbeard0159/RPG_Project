const express = require('express');
const router = express.Router();
const path = require('path');
// Get the connection pool from the connection module
const pool = require('../database-data/connection');

// test route landing page
router.get('/', function (req, res) {
    res.send(`<p><a href="/test/view/characters">Characters</a></p>\
    <p><a href="/test/view/enemys">Enemys</a></p>
    <p><a href="/test/view/attacks">Attacks</a></p>
    <p><a href="/test/view/supports">Supports</a></p>`);
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
        res.json(result);
    });

});
// END VIEW ENTRIES


// DELETE ENTRY
router.get('/delete/:tableName/:id', function (req, res) {

    // Generate SQL
    let sql = `DELETE FROM rpg_project_db.${req.params.tableName} WHERE id_${req.params.tableName} = ${req.params.id}; `;
   
    // Get a connection from the pool and run the query
    pool.query(sql, function (err) {
        if (err) throw err;
        console.log(`${req.params.tableName} updated`);
    });
    res.redirect(`/test/view/${req.params.tableName}`);
});
// END DELETE ENTRY

// CREATE ENTRY -form page-
router.get('/create/:tableName', function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/create-${req.params.tableName}.html`));
});
// CREATE NEW ENTRY -recieve form data-
router.post('/entryResponse/:tableName', function (req, res) {
    let sql = '';
    let firstLoop = true;
    let input = req.body;
    let stats = {};
    let attacks = {};
    let supports = {};

    for (let field in input) {
        if (field.includes("attacks-")) {
            attacks[field] = input[field];
        }
        else if (field.includes("supports-")) {
            supports[field] = input[field];
        }
        else {
            stats[field] = input[field];
        }
    }

    // Convert the form data into an sql query
    sql = `INSERT INTO rpg_project_db.${req.params.tableName} (`;
    for (let field in stats) {
        if (!firstLoop) sql += ',';
        sql += `${field}`;
        firstLoop = false;
    }
    sql += `) VALUES (`;
    firstLoop = true;
    for (let field in stats) {
        if (!firstLoop) sql += ',';
        sql += `'${stats[field]}'`;
        firstLoop = false;
    }
    sql += `);`;

    // Get a connection from the pool and run the query
    pool.query(sql, function (err) {
        if (err) throw err;
        console.log(`${req.params.tableName} updated`);
    });
    res.redirect(`/test/view/${req.params.tableName}`);
});
// END CREATE NEW ENTRY


// EDIT EXISTING ENTRY -form page-
router.get(`/edit/:tableName/:id`, function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/edit-${req.params.tableName}.html`));
});
// EDIT EXISTING ENTRY -populate form-
router.get('/viewEntry/:tableName/:id', function (req, res) {

    // Generate SQL query
    let sql = '';
    sql = `SELECT * FROM rpg_project_db.${req.params.tableName} \
        WHERE id_${req.params.tableName} = ${req.params.id}`;

    // Get a connection from the pool and run the query
    pool.query(sql, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});
// EDIT EXISTING ENTRY -recieve form data-
router.post('/editResponse/:tableName/:id', function (req, res) {
    // Generate SQL query
    let sql = '';
    let firstLoop = true;
    let input = req.body;
    let stats = {};
    let attacks = {};
    let supports = {};

    console.log(input);

    for (let field in input) {
        if (field.includes("attacks-")) {
            attacks[field] = input[field];
        }
        else if (field.includes("supports-")) {
            supports[field] = input[field];
        }
        else {
            stats[field] = input[field];
        }
    }

    // Send the unit's stats to the database
    sql = `UPDATE rpg_project_db.${req.params.tableName} SET `;
    for (let field in stats) {
        if (!firstLoop) sql += ',';
        sql += `${field} = '${stats[field]}'`;
        firstLoop = false;
    }
    sql += ` WHERE id_${req.params.tableName} = '${req.params.id}'`;

    // Get a connection from the pool and run the query
    pool.query(sql, function (err) {
        if (err) throw err;
        console.log(`${req.params.tableName} updated`);
    });

    // Send the unit's attacks to the database
    sql = `SELECT * FROM rpg_project_db.${req.params.tableName}_attacks WHERE id_characters = '${req.params.id}'`
    pool.query(sql, function (err, result) {
        sql = '';
        // Add new entries before deleting obsolete ones
        for (let attack in attacks) {
            sql = `REPLACE INTO rpg_project_db.${req.params.tableName}_attacks \
            SET id_${req.params.tableName} = '${req.params.id}', ${attacks[attack]}; `;
            pool.query(sql, function (err) {
                if (err) throw err;
                console.log("Attack Added");
            });
        }
        // Find and remove outdated entries
        for (let entry in result) {
            let checkString = `id_attacks = ${result[entry]['id_attacks']}`;
            let check = false;
            for (let attack in attacks) {
                if(checkString == attacks[attack]) {
                    check = true;
                }
            }
            if (!check) {
                sql = `DELETE FROM rpg_project_db.${req.params.tableName}_attacks WHERE (id_attacks = '${result[entry]['id_attacks']}' AND id_${req.params.tableName} = '${req.params.id}'); `;
                pool.query(sql, function (err) {
                    if (err) throw err;
                    console.log("Attack Removed");
                });
            }
        }

        // Send the unit's supports to the databse
        sql = `SELECT * FROM rpg_project_db.${req.params.tableName}_supports WHERE id_characters = '${req.params.id}'`
        pool.query(sql, function (err, result) {
            sql = '';
            // Add new entries before deleting obsolete ones
            for (let support in supports) {
                sql = `REPLACE INTO rpg_project_db.${req.params.tableName}_supports \
                SET id_${req.params.tableName} = '${req.params.id}', ${supports[support]}; `;
                pool.query(sql, function (err) {
                    if (err) throw err;
                    console.log("Support Added");
                });
            }
            // Find and remove outdated entries
            for (let entry in result) {
                let checkString = `id_supports = ${result[entry]['id_supports']}`;
                let check = false;
                for (let support in supports) {
                    if(checkString == supports[support]) {
                        check = true;
                    }
                }
                if (!check) {
                    sql = `DELETE FROM rpg_project_db.${req.params.tableName}_supports WHERE (id_supports = '${result[entry]['id_supports']}' AND id_${req.params.tableName} = '${req.params.id}'); `;
                    pool.query(sql, function (err) {
                        if (err) throw err;
                        console.log("Support Removed");
                    });
                }
            }
            res.redirect(`/test/view/${req.params.tableName}`);
    
        });
    });


});
// END EXISTING ENTRY

// ABILITIES -get id, name-
router.get('/get-abilities/:unit/:ability/:id', function(req, res) {
    let tableName = `${req.params.unit}_${req.params.ability}`;

    let sql = `SELECT id_${req.params.ability}, ${(req.params.ability).slice(0, -1)}_name, description \
    FROM rpg_project_db.${req.params.ability} WHERE id_${req.params.ability} \
    IN (SELECT id_${req.params.ability} \
    FROM rpg_project_db.${tableName} WHERE id_${req.params.unit} = '${req.params.id}')`;

    // Get a connection from the pool and run the query
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`${req.params.ability}(s) retrieved`);
        res.json(result);
    });
});

// ABILITIES -get all-
router.get('/get-abilities/:ability/', function(req, res) {

    // Generate SQL
    let sql = `SELECT * \
    FROM rpg_project_db.${req.params.ability}`;

    // Get a connection from the pool and run the query
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`${req.params.ability}(s) retrieved`);
        res.json(result);
    });
});

// ABILITYS -set-


module.exports = router;