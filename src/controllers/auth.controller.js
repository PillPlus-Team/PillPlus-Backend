const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { errorRes, successRes, errData } = require("../common/response");
const db = require("../models");
const mongoose = db.mongoose;
const User = db.user;

/// Login controller
exports.findByEmail = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }, "+password", { lean: true }, (err, data) => {
    if (err || !data)
      return errorRes(res, "invalid login", "invalid password or email");
    req.body = { unhashedPassword: password, ...data };
    return next();
  });
}

exports.verifyPassword = (req, res, next) => {
  const { unhashedPassword, password, ...userData } = req.body;
  bcrypt.compare(unhashedPassword, password, (err, same) => {
    if (same) {
      req.body = userData;
      return next();
    } else return errorRes(res, err, "password error, try again");
  });
}

exports.login = async (req, res) => {
  var user = req.body;
  var token = await jwt.sign(req.body, process.env.JWT_SECRET, {
    algorithm: "HS512",
    expiresIn: "1d",
  });

  res.status(200).send({
    id: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    phone: user.phone,
    roles: user.role,
    avatarUrl: user.avatarUrl,
    accessToken: token,
  });
}

// Signup controller
exports.hashPassword = (req, res, next) => {
    const { password } = req.body;
    bcrypt.hash(password, 10, (err, hashed) => {
      if (err) return errorRes(res, err, "unable to sign up, try again");
      req.body.password = hashed;
      next();
    });
}
  
exports.signUp = (req, res) => {
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

// Valid password
exports.isValidPassword = (req, res, next) => {
    const { password } = req.body;
    if (!password || password.length < 6) {
      const err = `invalid password ${password}`;
      const errMsg = "password must be at least 6 characters";
      return errorRes(res, err, errMsg);
    }
    return next();
}

// Update Profile
exports.updateProfile = (req, res) => {

}