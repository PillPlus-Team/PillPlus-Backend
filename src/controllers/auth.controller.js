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
  var { _id, name, surname, email, phone, role, avatarUrl } = req.body;
  var token = await jwt.sign(
    { _id, role },
    process.env.JWT_SECRET,
    {
      algorithm: "HS512",
      expiresIn: "1d",
    }
  );

  res.cookie("cookieToken", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 30*60*1000 }); // add secure: true for production

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
      console.log(data);
      const { _id, name, email, role } = data;
      return successRes(res, { _id, name, email, role });
    });
}

// Valid password
exports.isValidPassword = (req, res, next) => {
    const { password,  } = req.body;
    if (!password || password.length < 6) {
      const err = `invalid password ${password}`;
      const errMsg = "password must be at least 6 characters";
      return errorRes(res, err, errMsg);
    }
    return next();
}

// Update Profile
exports.updateProfile = async (req, res) => {
  const { name, surname, email, phone, avatarUri } = req.body;

  await User.findOne({
      email: req.body.email
  }, async (err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!user || user._id == req.user._id) {

      await User.findOneAndUpdate(
        req.user._id,
        req.body,
        async (err, user) => {
          if (err) 
            return res.status(500).send({ message: err });
    
            res.status(200).send({
              name,
              surname,
              email,
              phone,
              avatarUri,
              // accessToken: token, // use cookie instead
            });
        }
      )

    } else {
      return res.status(400).send({ message: "Failed! Email is already in use!"})
    }
  })
}

// Reset password
exports.resetPassword = async (req, res) => {
    const { password, newPassword, reNewPassword } = req.body;

    User.findOne({
        _id: req.user._id
    },  "+password",
        async (err, user) => {
            if (err) {
                return res.status(500).send({ message: err });
            }

            await bcrypt.compare(password, user.password, (err, same) => {
                if (err) {
                  return res.status(500).send({ message: err });
                }
                
                if (!same) {
                    return errorRes(res, err, "password error, try again");
                }

                if (newPassword !== reNewPassword) {
                    return res.status(400).send({ message: "Failed! New password and Confirm password doesn't match!"})
                }

                bcrypt.hash(newPassword, 10, async (err, hashed) => {
                    if (err) 
                        return errorRes(res, err, "unable to sign up, try again");

                    await User.findOneAndUpdate(
                        req.user._id, {
                        password: hashed
                      },
                        async (err, user) => {
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

exports.isValidNewPassword = (req, res, next) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    const err = `invalid password ${newPassword}`;
    const errMsg = "password must be at least 6 characters";
    return errorRes(res, err, errMsg);
  }

  return next();
}

// Log out
exports.logOut = (req, res) => {

}
