const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User")
const { errorRes, successRes, errData } = require("../common/response");

function findByEmail(req, res, next) {
    const { email, password } = req.body;
    User.findOne({ email }, "+password", { lean: true }, (err, data) => {
      if (err || !data)
        return errorRes(res, "invalid login", "invalid password or email");
      req.body = { unhashedPassword: password, ...data };
      return next();
    });
  }
  
  function verifyPassword(req, res, next) {
    const { unhashedPassword, password, ...userData } = req.body;
    bcrypt.compare(unhashedPassword, password, (err, same) => {
      if (same) {
        req.body = userData;
        return next();
      } else return errorRes(res, err, "password error, try again");
    });
  }
  
  function login(req, res) {
    jwt.sign(
      req.body,
      process.env.JWT_SECRET,
      { algorithm: "HS512", expiresIn: "1d" },
      errData(res, "token error")
    );
  }

  module.exports = {
      findByEmail,
      verifyPassword,
      login
  }