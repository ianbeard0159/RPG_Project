const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

// Set up routes
const testRouter = require('./routes/testRoute');
const gameRouter = require('./routes/gameRoute');

// Set up static files
app.use(express.static('static'));

// Enable reading data from forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

// Initialize the application
app.use('/test', testRouter);
app.use('/', gameRouter);

app.listen(3000, function () {
    console.log("server is running on port 3000");
})

