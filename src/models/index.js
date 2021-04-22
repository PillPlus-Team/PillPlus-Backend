const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User");
db.pill = require("./Pill");
db.pillStore = require("./PillStore");
db.pillStorehouse = require("./PillStorehouse");

module.exports = db;
