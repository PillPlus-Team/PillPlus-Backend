const express = require("express");
const { notFound } = require("../common/middleware");
const {
  findByEmail,
  verifyPassword,
  login,
} = require("../controllers/login-controller");
const { hashPassword, signUp } = require("../controllers/signup-controller");
const { isValidPassword } = require("../controllers/valid-password-controller");

const router = express.Router();

router.use(isValidPassword);
router.post("/signup", hashPassword, signUp);
router.post("/login", findByEmail, verifyPassword, login);
router.use(notFound);

module.exports = router;
