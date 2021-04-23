const express = require("express");
const { notFound, handlePassword, verifyToken } = require("../common/middleware");
const {
  findByEmail,
  verifyPassword,
  login,
  isValidNewPassword,
  updateProfile,
  resetPassword,
  logout
} = require("../controllers/auth.controller");

const router = express.Router();

// ---------------------------- API ---------------------------- //

router.put("/updateProfile", verifyToken, updateProfile);
router.post("/login", handlePassword, findByEmail, verifyPassword, login);
router.put("/resetPassword", verifyToken, isValidNewPassword, resetPassword);
router.get("/logout", logout);
router.use(notFound);

module.exports = router;
