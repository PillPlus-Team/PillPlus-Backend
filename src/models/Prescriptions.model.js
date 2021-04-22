const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const PrescriptionsSchema = new Schema(
    {
        _id: ObjectId,
        hn: {
            type: String,
            required: true
        },
        name: {
            type: String,
        }
    }
);

module.exports = mongoose.model("Prescriptions", PrescriptionsSchema, "Prescriptions");