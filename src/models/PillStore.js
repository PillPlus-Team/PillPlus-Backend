const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PillStoreSchema = new Schema(
  {
    _id: ObjectId,
    ID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    pharmacy: { type: String, required: true },
    location: { type: String, required: true },
    coordinate: {
      lat: { type: String, required: true },
      lng: { type: String, required: true }
    },
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
      validate: [/^[\w]+[\.\w-]*?@[\w]+(\.[\w]+)+$/, "invalid email"],
    },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

PillStoreSchema.plugin(uniqueValidator);
module.exports = mongoose.model("PillStore", PillStoreSchema, "PillStores");
