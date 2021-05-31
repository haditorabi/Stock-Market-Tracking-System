const express = require('express');
const app = express();
const winston = require('winston');
const bodyParser = require("body-parser")

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3003;

const server = app.listen(port, () => winston.info(`Listening on port ${port}`));

module.exports = server;