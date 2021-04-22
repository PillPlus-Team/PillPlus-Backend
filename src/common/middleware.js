const { errorRes } = require("./response");

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

module.exports = {
  notFound,
  onlyAdmin,
  notOnlyMembers,
};
