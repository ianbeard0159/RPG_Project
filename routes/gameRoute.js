const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/index' , function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/index.html`));
});

router.get('/game' , function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/game.html`));
});

router.get('/select' , function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/select.html`));
});

router.get('/tutorial' , function (req, res) {
    res.sendFile(path.join(`${__dirname}/../static/html/tutorial.html`));
});



module.exports = router;