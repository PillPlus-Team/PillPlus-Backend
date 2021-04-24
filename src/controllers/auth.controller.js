const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { errorRes } = require("../common/response");
const db = require("../models");
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
  var { _id, name, surname, email, phone, role, avatarUrl } = req.body;
  var token = await jwt.sign(
    { _id, role },
    process.env.JWT_SECRET,
    {
      algorithm: "HS512",
      expiresIn: "1d",
    }
  );

  res.cookie("cookieToken", token, { httpOnly: true });
  //res.cookie("cookieToken", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 12*60*60*1000 }); // add secure: true for production

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

// Update Profile
exports.updateProfile = (req, res) => {

  User.findOne({
      email: req.body.email
  }).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!user || user._id == req.user._id) {

      User.findOne({
        phone: req.body.phone
      }).exec((err, user) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        if (!user || user._id == req.user._id) {

          User.findOneAndUpdate(
            req.user._id,
            req.body,
            { new: true })
            .exec((err, user) => {
              if (err) 
                return res.status(500).send({ message: err });
    
                console.log(user);
                res.status(200).send({
                  name: user.name,
                  surname: user.surname,
                  email: user.email,
                  phone: user.phone,
                  avatarUri: user.avatarUri,
                  // accessToken: token, // use cookie instead
                });
            }
          )

        } else {
          return res.status(400).send({ message: "Failed! Phone number is already in use!"});
        }
      })

    } else {
      return res.status(400).send({ message: "Failed! Email is already in use!"})
    }
  })
}

// Reset password
exports.resetPassword = (req, res) => {
    const { password, newPassword, reNewPassword } = req.body;

    User.findOne({
        _id: req.user._id
    },  "+password",
        (err, user) => {
            if (err) {
                return res.status(500).send({ message: err });
            }

            bcrypt.compare(password, user.password, (err, same) => {
                if (err) {
                  return res.status(500).send({ message: err });
                }

                if (!same) {
                    return errorRes(res, err, "password error, try again");
                }

                if (newPassword !== reNewPassword) {
                    return res.status(400).send({ message: "Failed! New password and Confirm password doesn't match!"})
                }

                bcrypt.hash(newPassword, 10, (err, hashed) => {
                    if (err) 
                        return errorRes(res, err, "unable to reset password, try again");

                    User.findOneAndUpdate(
                        req.user._id, {
                        password: hashed
                      },
                        (err, user) => {
                            if (err) 
                                return res.status(500).send({ message: err });
                        
                            return res.status(200).send({ message: "Reset password successful!" });
                        }
                    );
                }); 
            });
        }
    )
}

exports.handleNewPassword = (req, res, next) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    const err = `invalid password ${newPassword}`;
    const errMsg = "password must be at least 6 characters";
    return errorRes(res, err, errMsg);
  }

  return next();
}

// Log out
exports.logout = (req, res) => {
   res.cookie("cookieToken",'', { httpOnly: true, secure: true, sameSite: "None" , maxAge: -1 });
   res.end();
}
