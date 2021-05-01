const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { errorRes } = require("../common/response");
const db = require("../models");
const User = db.user;
const PillStore = db.pillStore;

// Auth middleware
exports.findByEmail = (model) => {
  return (req, res, next) => {
    const { email, password } = req.body;
    model.findOne(
      { email },
      "+password -createdAt -updatedAt",
      { lean: true },
      (err, data) => {
        if (err || !data)
          return errorRes(res, "invalid login", "invalid password or email");
        req.body = { unhashedPassword: password, ...data };
        return next();
      }
    );
  };
};

exports.verifyPassword = (req, res, next) => {
  const { unhashedPassword, password, ...userData } = req.body;
  bcrypt.compare(unhashedPassword, password, (err, same) => {
    if (same) {
      req.body = userData;
      return next();
    } else return errorRes(res, err, "password error, try again");
  });
};

/// Login controller
exports.login = (model) => {
  return async (req, res) => {
    try {
      var token = await createToken(req, res, model);

      //res.cookie("cookieToken", token, { httpOnly: true });
      res.cookie("cookieToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 12 * 60 * 60 * 1000,
      }); // add secure: true for production

      await delete req.body._id;
      return res.status(200).send({
        ...req.body,
      });
    } catch (err) {
      return res.status(500).send({ message: "Login failed!" });
    }
  };
};

async function createToken(req, res, model) {
  var { _id, role } = req.body;
  var mode = model === User ? "HOSPITAL" : "PILL STORE";

  return await jwt.sign({ _id, role, mode }, process.env.JWT_SECRET, {
    algorithm: "HS512",
    expiresIn: "1d",
  });
}

// Patients login
const Invoice = db.invoice;

exports.patientLogin = (req, res) => {
  try {
    Invoice.findOne(
      { _id: req.body._id }
    )
      .populate("pillStore") 
      .exec(async (err, inv) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        if (req.body.identificationNumber == inv.identificationNumber) {
          var token = await jwt.sign(
            { _id: inv._id, mode: "PATIENT" },
            process.env.JWT_SECRET,
            {
              algorithm: "HS512",
              expiresIn: "10m",
            }
          );

          //res.cookie("cookieToken", token, { httpOnly: true });
          res.cookie("cookieToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 10 * 60 * 1000,
          }); // add secure: true for production

          return res.status(200).send(inv);
        } else {
          return res
            .status(500)
            .send({ message: "Cannot get data by this ID!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).send({ message: "Cannot get data by this ID!" });
  }
};

// Update Profile
exports.updateProfile = (model) => {
  return (req, res) => {
    model
      .findOne({
        email: req.body.email,
      })
      .exec((err, user) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        if (!user || user._id == req.user._id) {
          model
            .findOne({
              phone: req.body.phone,
            })
            .exec((err, user) => {
              if (err) {
                return res.status(500).send({ message: err });
              }

              if (!user || user._id == req.user._id) {
                model
                  .findOneAndUpdate({ _id: req.user._id }, req.body, {
                    new: true,
                  })
                  .exec(async (err, user) => {
                    if (err) return res.status(500).send({ message: err });

                    console.log(user);
                    if (model === PillStore) {
                      if (user.coordinate && user.openingData.length !== 0) {
                        user.activated = true;
                      } else {
                        user.activated = false;
                      }

                      model
                        .findOneAndUpdate({ _id: req.user._id }, user, {
                          new: true,
                        })
                        .exec((err, update) => {
                          if (err)
                            return res.status(500).send({ message: err });
                          user = update;
                        });
                    }

                    await delete user._doc._id;
                    await delete user._doc.ID;
                    res.status(200).send({
                      ...user._doc,
                    });
                  });
              } else {
                return res
                  .status(400)
                  .send({ message: "Failed! Phone number is already in use!" });
              }
            });
        } else {
          return res
            .status(400)
            .send({ message: "Failed! Email is already in use!" });
        }
      });
  };
};

// Reset password
exports.resetPassword = (model) => {
  return (req, res) => {
    const { password, newPassword, reNewPassword } = req.body;

    model.findOne({ _id: req.user._id }, "+password", (err, user) => {
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
          return res.status(400).send({
            message: "Failed! New password and Confirm password doesn't match!",
          });
        }

        bcrypt.hash(newPassword, 10, (err, hashed) => {
          if (err) return errorRes(res, err, "unable to sign up, try again");

          model.findOneAndUpdate(
            { _id: req.user._id },
            { password: hashed },
            (err, user) => {
              if (err) return res.status(500).send({ message: err });

              if (!user)
                return res
                  .status(500)
                  .send({ message: "Cannot reset password!!" });

              return res
                .status(200)
                .send({ message: "Reset password successful!" });
            }
          );
        });
      });
    });
  };
};

exports.handleNewPassword = (req, res, next) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    const err = `invalid password ${newPassword}`;
    const errMsg = "password must be at least 6 characters";
    return errorRes(res, err, errMsg);
  }

  return next();
};

// Log out
exports.logout = (req, res) => {
  res.cookie("cookieToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: -1,
  });
  return res.end();
};
