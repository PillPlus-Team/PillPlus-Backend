const { errorRes } = require('../common/response')

function isValidPassword(req, res, next) {
    const { password } = req.body;
    if (!password || password.length < 6) {
      const err = `invalid password ${password}`;
      const errMsg = "password must be at least 6 characters";
      return errorRes(res, err, errMsg);
    }
    return next();
  }

  module.exports.isValidPassword = isValidPassword;