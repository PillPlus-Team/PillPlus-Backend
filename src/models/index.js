const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.id = require("./ID.model");
db.user = require("./User.model");
db.pill = require("./Pill.model");
db.queue = require("./Queue.model");
db.socket = require("./Socket.model");
db.invoice = require("./Invoices.model");
db.pillStore = require("./PillStore.model");
db.prescriptions = require("./Prescriptions.model");
db.pillStorehouse = require("./PillStorehouse.model");

module.exports = db;
