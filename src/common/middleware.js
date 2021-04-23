const { errorRes } = require("./response");
const User = require("../models").user;

const bcrypt = require("bcrypt");

function notFound(req, res, _) {
  return errorRes(res, "no routes", "you are lost.", 404);
}

function onlyAdmin(req, res, next) {
  if (req.user.role === "Administrator" || req.user.role === "Super Administrator")
    return next();
  return invalidToken(req, res);
}

function notOnlyMembers(req, res, next) {
  if (req.user.role === "member") return invalidToken(req, res);
  return next();
}

function invalidToken(req, res) {
  const errMsg = "INVALID TOKEN";
  const userText = JSON.stringify(req.user);
  const err = `${errMsg} ERROR - user: ${userText}, IP: ${req.ip}`;
  return errorRes(res, err, errMsg, 401);
}

function verifyToken(req, res, next) {
  if (!req.user)
    return invalidToken(req, res);
  return next();
}

// Valid password
function handlePassword(req, res, next) {
  const { password, ...body } = req.body;
  if (!password || password.length < 1) {
    req.body = body;
    return next();
  }
  if (password.length < 6)
    return errorRes(
      res,
      "invalid password",
      "password must be at least 6 characters"
    );

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return errorRes(res, err, "password error");
    const data = { ...body, password: hash };
    req.body = data;
    return next();
  });
}

// Check duplicate Email and Phone
function checkDuplicateEmailOrPhone(req, res, next) {
  // Username
  User.findOne({
      email: req.body.email
  }).exec((err, user) => {
      if (err) {
          res.status(500).send({ message: err });
          return;
      }

      if (user) {
          res.status(400).send({ message: "Failed! Email is already in use!"});
          return;
      }

      // Email
      User.findOne({
          phone: req.body.phone
      }).exec((err, user) => {
          if (err) {
              res.status(500).send({ message: err });
              return;
          }

          if (user) {
              res.status(400).send({ message: "Failed! Phone is already in use!"});
              return;
          }

          next();
      });

  });
};

module.exports = {
  notFound,
  onlyAdmin,
  notOnlyMembers,
  verifyToken,
  handlePassword,
  checkDuplicateEmailOrPhone,
};
