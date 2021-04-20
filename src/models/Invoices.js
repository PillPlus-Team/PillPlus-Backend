const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const invoiceSchema = new Schema(
  {
    _id: ObjectId,
    hn: {
      type: String,
      required: true,
      validator: [/[0-9]{8,8}/, "invalid HN number"],
    },
    name: { type: String, required: true },
    startTime: { type: Date, default: Date.now() },
    queueNo: { type: Number, required: true },
    doctor: { type: String, required: true },
    pillStorePhamacy: { type: String, required: true },
    pillStoreLocation: { type: String, required: true },
    pills: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        unit: { type: String, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    serviceCharge: { type: Number, required: true },
    totalPay: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema, "invoices");
