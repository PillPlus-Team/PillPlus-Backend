const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.pill = require("./Pill");
db.pillStore = require("./PillStore");
db.user = require("./User");

module.exports = db;
