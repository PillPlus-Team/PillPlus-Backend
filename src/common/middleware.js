const { errorRes } = require("./response");

function notFound(req, res, _) {
  return errorRes(res, "no routes", "you are lost.", 404);
}

function onlyAdmin(req, res, next) {
  if (req.user.role === "Administrator" || req.user.role === "Super Administrator")
    return next();
  return invalidToken(req, res);
}

function forCashier(req, res, next) {
  if (req.user.role === "Cashier" || req.user.role === "Administrator" || req.user.role === "Super Administrator")
    return next();
  return invalidToken(req, res);
}

function forStaff(req, res, next) {
  if (req.user.role === "Staff" || req.user.role === "Administrator" || req.user.role === "Super Administrator")
    return next();
  return invalidToken(req, res);
}

function forHospital(req, res, next) {
  if (req.user.mode === "HOSPITAL")
    return next();
  return invalidToken(req, res);
}

function forPatient(req, res, next) {
  if (req.user.mode === "PATIENT")
    return next();
  return invalidToken(req, res);
}

function forPillStore(req, res, next) {
  if (req.user.mode === "PILL STORE")
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
  return res.writeHead(302, {location: '/login'});
}

function verifyToken(req, res, next) {
  if (!req.user) {
    return invalidToken(req, res);
  }
  return next();
}

module.exports = {
  notFound,
  onlyAdmin,
  forCashier,
  forStaff,
  forHospital,
  forPatient,
  forPillStore,
  notOnlyMembers,
  verifyToken,
};
