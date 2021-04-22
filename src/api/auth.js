const express = require("express");
const { notFound } = require("../common/middleware");
const {
  findByEmail,
  verifyPassword,
  login,
  hashPassword,
  signUp,
  isValidPassword,
  isValidNewPassword,
  updateProfile,
  resetPassword
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/updateProfile", updateProfile);

router.use(isValidPassword);
router.post("/signup", hashPassword, signUp);
router.post("/login", findByEmail, verifyPassword, login);

router.use(isValidNewPassword);
router.post("/resetPassword", resetPassword);
router.use(notFound);

module.exports = router;
