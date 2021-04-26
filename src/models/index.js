const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User");
db.pill = require("./Pill");
db.id = require("./ID.model");
db.invoice = require("./Invoices");
db.queue = require("./Queue.model");
db.socket = require("./Socket");
db.pillStore = require("./PillStore");
db.pillStorehouse = require("./PillStorehouse");
db.prescriptions = require("./Prescriptions.model");

module.exports = db;
