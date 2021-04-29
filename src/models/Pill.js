const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const pillSchema = new Schema(
  {
    _id: ObjectId,
    sn: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, require: true },
    type: { type: String, enum: ["ED", "NED"], required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

pillSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Pill", pillSchema, "pills");
