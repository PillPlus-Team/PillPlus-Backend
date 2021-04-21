const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { errorRes, successRes, errData } = require("../common/response");
const User = require("../models").user;

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

async function login(req, res) {
  var { _id, name, surname, email, phone, role, avatarUrl } = req.body;
  var token = await jwt.sign(
    { name, surname, email, phone, role },
    process.env.JWT_SECRET,
    {
      algorithm: "HS512",
      expiresIn: "1d",
    }
  );

  res.cookie("cookieToken", token, { httpOnly: true }); // add secure: true for production

  res.status(200).send({
    id: _id,
    name: name,
    surname: surname,
    email: email,
    phone: phone,
    role: role,
    avatarUrl: avatarUrl,
    // accessToken: token, // use cookie instead
  });
}

module.exports = {
  findByEmail,
  verifyPassword,
  login,
};
