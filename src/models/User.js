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
      validate: [validator.isEmail, "invalid email"],
    },
    type: {
      type: String,
      enum: ["admin", "staff", "pharmacy"],
      required: true,
    },
    password: { type: String, required: true, select: false }
  },
  {
      timestamps: true, versionKey: false
  }
);

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema, "users");
