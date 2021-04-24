const express = require("express");
const multer = require("multer");
const router = express.Router();
const crypto = require("crypto");
const mime = require("mime");
const { errorRes, successRes } = require("../common/response");
const User = require("../models").user;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "avatars/");
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString("hex") + "." + mime.extension(file.mimetype));
    });
  },
});

const upload = multer({
  storage: storage,
});

router.post("/avatar", upload.single("avatar"), (req, res, next) => {
  if (!req.file) return errorRes(res, "upload failed", 401);
  return successRes(res, { avatarUri: req.file.filename });
});

router.get("/avatar", (req, res) => {
  res.sendFile(req.body.avatarUri, { root: "./avatars" });
});

module.exports = router;
