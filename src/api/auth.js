const express = require("express");
const { notFound, verifyToken } = require("../common/middleware");
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

router.put("/updateProfile", verifyToken, updateProfile);

router.use(isValidPassword);
router.post("/signup", hashPassword, signUp);
router.post("/login", findByEmail, verifyPassword, login);

router.use(verifyToken);
router.use(isValidNewPassword);
router.put("/resetPassword", resetPassword);
router.use(notFound);

module.exports = router;
