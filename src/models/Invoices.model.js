const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const invoiceSchema = new Schema(
  {
    _id: { type: String, default: Date.now },
    prescriptionID: { type: String, required: true, select: false  },
    identificationNumber: { type: String, required: true },
    hn: {
      type: String,
      required: true,
      validator: [/[0-9]{8,8}/, "invalid HN number"],
    },
    name: { type: String, required: true },
    startTime: { type: String, default: Date.now },
    queueNo: { type: String, required: true },
    doctor: { type: String, required: true },
    pillStore: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "PillStore"
    },
    pills: [
      {
        _id: { type: ObjectId, select: false },
        sn: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        unit: { type: String, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    serviceCharge: { type: Number, required: true },
    totalPay: { type: Number, required: true },
    paidStatus: { type: Boolean, default: false, required: true, select: false },
    dispenseDate: { type: Date }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema, "Invoices");
