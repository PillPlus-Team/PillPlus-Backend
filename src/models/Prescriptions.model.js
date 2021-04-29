const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const PrescriptionsSchema = new Schema(
    {
        _id: ObjectId,
        hn: { type: String, required: true },
        identificationNumber: { type: String, required: true },
        name: { type: String, required: true },
        startTime: { type: String, default: Date.now },
        queueNo: { type: String, required: true },
        doctor: { type: String, required: true },
        pills: [{
            _id: { type: ObjectId, select: false },
            sn: { type: String, required: true },
            name: { type: String, required: true },
            description: { type: String, required: true },
            amount: { type: String, required: true },
            unit: { type: String, required: true }
        }],
        status: { type: Boolean, default: false, required: true }
    }, {
        timestamps: false,
        versionKey: false
    }
);

module.exports = mongoose.model("Prescriptions", PrescriptionsSchema, "Prescriptions");