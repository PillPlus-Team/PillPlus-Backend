const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const invoiceSchema = new Schema(
  {
    _id: ObjectId,
    prescriptionID: { type: String, required: true },
    identificationNumber: { type: String, required: true },
    hn: {
      type: String,
      required: true,
      validator: [/[0-9]{8,8}/, "invalid HN number"],
    },
    name: { type: String, required: true },
    startTime: { type: Date, default: Date.now() },
    queueNo: { type: String, required: true },
    doctor: { type: String, required: true },
    pillStoreID: { type: String, required: true },
    pillStorePharmacy: { type: String, required: true },
    pillStoreLocation: { type: String, required: true },
    pills: [
      {
        _id: { type: ObjectId, select: false },
        sn: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        unit: { type: String, required: true },
        totalPrice: { type: Number, default: 100, required: true },
      },
    ],
    serviceCharge: { type: Number, default: 30, required: true },
    paidStatus: { type: Boolean, default: false, required: true }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema, "invoices");
