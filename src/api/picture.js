const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const { errorRes, successRes } = require("../common/response");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "avatars/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.post("/avatar", upload.single("avatar"), (req, res, next) => {
  if (!req.file) return errorRes(res, "upload failed", 401);
  return successRes(res, { url: req.file.path });
});

router.get("/avatar", (req, res) => {
  const { filename } = req.body;
  res.sendFile(filename, { root: "./avatars" });
});

module.exports = router;
