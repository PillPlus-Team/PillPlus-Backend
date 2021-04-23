const bcrypt = require("bcrypt");
const { errorRes } = require("../common/response");
const db = require("../models");
const mongoose = db.mongoose;
const User = db.user;

// Create account
exports.addAccount = (req, res) => {
    if (!req.body.avatarUri)
        req.body.avatarUri = "http://";

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });
    return newUser.save((err, data) => {
      if (err) 
        return errorRes(res, err, "unable to create user");
    
      const { _id, name, surname, email, phone, role, avatarUri } = data;

      return res.status(200).send({ _id, 
                                    name, 
                                    surname, 
                                    email, 
                                    phone, 
                                    role,
                                    avatarUri
                                });
    });
}

// Get all accounts
exports.getAllAccounts = async (req, res) => {
    User.find({}, "-createdAt -updatedAt", (err, user) => {
        if (err) {
            return res.status(500).send({ message: "Cannot get all accounts!!" });
        }
        return res.status(200).send(user);
    })
}

// Update Profile
exports.updateAccount = async (req, res) => {
    const { name, surname, email, phone } = req.body;
  
    await User.findOne({
        email: req.body.email
    }, async (err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

    
      if (!user || user._id == req.params._id) {
  
        await User.findOneAndUpdate({
          _id: req.params._id
        },
          req.body,
          async (err, user) => {
            if (err) 
              return res.status(500).send({ message: err });
      
              res.status(200).send({
                _id: req.params._id,
                name,
                surname,
                email,
                phone,
                // accessToken: token, // use cookie instead
              });
          }
        )
  
      } else {
        return res.status(400).send({ message: "Failed! Email is already in use!"})
      }
    })
}

  // Delete account 
exports.deleteAccount = async (req, res) => {
    User.deleteOne({
        _id: req.params._id
    }, (err) => {
        if (err) {
            return res.status(500).send({ message: "Cannot delete this account!" })
        }

        return res.status(200).send({ message: "Deleted account successfully!" })
    })
}