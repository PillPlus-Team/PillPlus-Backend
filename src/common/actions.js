const bcrypt = require("bcrypt");

// Valid password
function handlePassword(req, res, next) {
    const { password, ...body } = req.body;
  
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
  const checkDuplicateEmailOrPhone = (model) => {
  
    return (req, res, next) => {
      // Email
      model.findOne({ email: req.body.email }).exec((err, user) => {
          if (err)
              return res.status(500).send({ message: err });
          if (user)
              return res.status(400).send({ message: "Failed! Email is already in use!"});
  
          // Phone
          model.findOne({ phone: req.body.phone }).exec((err, user) => {
              if (err)
                  return res.status(500).send({ message: err });
              if (user)
                  return res.status(400).send({ message: "Failed! Phone is already in use!"});
              next();
          });
      });
    }
  };

module.exports = {
    handlePassword,
    checkDuplicateEmailOrPhone
}