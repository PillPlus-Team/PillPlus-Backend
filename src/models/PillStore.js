const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { default: validator } = require("validator");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PillStoreSchema = new Schema(
  {
    _id: ObjectId,
    name: { type: String, required: true },
    pharmacy: { type: String, required: true },
    location: { type: String, required: true },
    Phone: {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PillStoreSchema.plugin(uniqueValidator);
module.exports = mongoose.model("PillStore", PillStoreSchema, "PillStores");
