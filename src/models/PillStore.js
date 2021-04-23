const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { default: validator } = require("validator");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PillStoreSchema = new Schema(
  {
    _id: ObjectId,
    ID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    pharmacy: { type: String, required: true },
    location: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      validate: [/[0-9]{9,10}/, "invalid phone number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "invalid email"],
    },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PillStoreSchema.plugin(uniqueValidator);
module.exports = mongoose.model("PillStore", PillStoreSchema, "PillStores");
