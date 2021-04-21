const express = require("express");
const router = express.Router();
const { create, read, update, remove } = require("../common/crud");
const User = require("../models").user;
const { onlyAdmin, notFound } = require("../common/middleware");
const bcrypt = require("bcrypt");
const { errorRes } = require("../common/response");

router.use(onlyAdmin);
router.post("/", create(User));
router.get("/all" /*, userAtPage*/, read(User)); // fetch All data
router.put("/:_id", handlePassword, update(User));
router.delete("/:_id", remove(User));

router.use(notFound);

// Use when fetch some data
function userAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

// function haveAvatar(req, res, next) {
//   const { avatar } = req.body;
//   if (!avatar) {
//     req.body.avatar = "avatar.jpg";
//   }
//   next();
// }

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

module.exports = router;