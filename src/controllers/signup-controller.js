const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
const { errorRes, successRes, errData } = require("../common/response");

function hashPassword(req, res, next) {
  const { password } = req.body;
  bcrypt.hash(password, 10, (err, hashed) => {
    if (err) return errorRes(res, err, "unable to sign up, try again");
    req.body.password = hashed;
    next();
  });
}

function signUp(req, res) {
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    ...req.body,
  });
  return newUser.save((err, data) => {
    if (err) return errorRes(res, err, "unable to create user");
    const { _id, name, email, type } = data;
    return successRes(res, { _id, name, email, type });
  });
}

module.exports = {
  hashPassword,
  signUp,
};
