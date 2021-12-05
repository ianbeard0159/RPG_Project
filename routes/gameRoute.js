const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database-data/connection');

router.get('/' , function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/index.html`));
});

router.get('/game' , function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/gamePage.html`));
});

router.get('/select' , function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/select.html`));
});

router.get('/tutorial' , function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/tutorial.html`));
});
router.get('/getUnit/:unitTable/:id', function(req, res){
    let unitTable = req.params.unitTable;
    let id = req.params.id;
    let sql = `SELECT * FROM rpg_project_db.${unitTable} WHERE id_${unitTable} = '${id}'`;
    pool.query(sql, function (err, result) {
    if (err) throw err;
    res.json(result);
    });
});
// Get all names and descriptions from characters/enemys
router.get('/getActions/:unitTable/:actiontable/:id', function (req, res) {
    let ActionT = req.params.actiontable;
    let unitTable = req.params.unitTable;
    let id = req.params.id;
    let junctionTable = unitTable + "_" + ActionT;
    let sql = `SELECT * FROM rpg_project_db.${ActionT} WHERE id_${ActionT} \
    IN (SELECT id_${ActionT} FROM rpg_project_db.${junctionTable} \
    WHERE id_${unitTable} = '${id}');`;
    pool.query(sql, function (err, result) {
    if (err) throw err;
    res.json(result);
    });
});

router.get('/getNames/:unitTable', function(req, res){
    let unitTable = req.params.unitTable;
    let str = '';
    if (unitTable == 'characters'){
         str = "char_name";
    }
    else if (unitTable == 'enemys') {
         str = "enemy_name";
    }
    let sql = `SELECT ${str}, description FROM rpg_project_db.${unitTable}`;
    pool.query(sql, function (err, result) {
    if (err) throw err;
    res.json(result);
    });
});
// Get all data from input character/enemy
//  |--> Get all attacks/supports from input character/enemy

module.exports = router;