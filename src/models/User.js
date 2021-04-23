const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const validator = require("validator");

const userSchema = new Schema(
  {
    _id: ObjectId,
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "invalid email"],
    },
    phone: {
      type: String,
      required: true,
      validate: [/[0-9]{9,10}/, "invalid phone number"],
    },
    role: {
      type: String,
      enum: ["Super Administrator", "Administrator", "Cashier", "Staff"],
      required: true,
    },
    avatarUri: { type: String, default: "avatar.jpg", required: true },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema, "users");
