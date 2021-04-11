const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.pill = require("./pill");
db.pillStore = require("./pillStore");
db.user = require("./user");

module.exports = db;