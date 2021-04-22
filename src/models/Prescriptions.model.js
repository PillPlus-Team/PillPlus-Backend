const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const PrescriptionsSchema = new Schema({

})

module.exports = mongoose.model("Prescriptions", PrescriptionsSchema, "Prescriptions");