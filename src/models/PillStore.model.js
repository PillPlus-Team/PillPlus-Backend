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
    openingData: [
      {
        day: { type: String },
        opening: { type: Boolean },
        openHour: { type: String },
        openMinute: { type: String },
        closeHour: { type: String },
        closeMinute: { type: String }
      }
    ],
    coordinate: {
      lat: { type: Number },
      lng: { type: Number }
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
    avatarUri: {
      type: String,
      default: "https://api.pillplus.store/api/v1/picture/avatar.jpg",
      required: true,
    },
    openingStatus: { type: Boolean, default: false, select: false },
    pillStorehouse_id: { type: String, select: false },
    password: { type: String, required: true, select: false },
    activated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PillStoreSchema.plugin(uniqueValidator);
module.exports = mongoose.model("PillStore", PillStoreSchema, "PillStores");
