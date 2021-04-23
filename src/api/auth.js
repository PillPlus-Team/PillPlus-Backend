const express = require("express");
const { notFound, verifyToken } = require("../common/middleware");
const {
  findByEmail,
  verifyPassword,
  login,
  handleNewPassword,
  updateProfile,
  resetPassword,
  logout
} = require("../controllers/auth.controller");

const router = express.Router();

// ---------------------------- API ---------------------------- //

router.put("/updateProfile", verifyToken, updateProfile);
router.post("/login", findByEmail, verifyPassword, login);
router.put("/resetPassword", verifyToken, handleNewPassword, resetPassword);
router.get("/logout", logout);
router.use(notFound);

module.exports = router;
