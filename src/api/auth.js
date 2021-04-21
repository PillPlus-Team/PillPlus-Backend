const express = require("express");
const { notFound } = require("../common/middleware");
const {
  findByEmail,
  verifyPassword,
  login,
  isValidPassword,
} = require("../controllers/auth.controller");

const router = express.Router();

router.use(isValidPassword);
router.post("/signup", hashPassword, signUp);
router.post("/login", findByEmail, verifyPassword, login);
router.use(notFound);

module.exports = router;
