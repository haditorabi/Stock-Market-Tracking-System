const winston = require('winston');
const config = require('config');
const mongoose = require('mongoose');
module.exports = function () {
    const db = config.get("db");
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    .then(() => winston.info(`Connect to ${db}`));
}
// mongoose.set('useFindAndModify', false);
