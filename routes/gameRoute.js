const express = require('express');
const router = express.Router();
const path = require('path');

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

// Get all names and descriptions from characters/enemys

// Get all data from input character/enemy
//  |--> Get all attacks/supports from input character/enemy

module.exports = router;