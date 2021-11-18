const express = require('express');
const app = express();

// Set up routes
const testRouter = require('./routes/testRoute');

app.use('/test', testRouter);

