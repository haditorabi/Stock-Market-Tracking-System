const express = require('express');
const app = express();
const winston = require('winston');
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => winston.info(`Listening on port ${port}`));

module.exports = server;