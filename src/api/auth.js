const express = require("express");
const { notFound, verifyToken } = require("../common/middleware");
const controller = require("../controllers/auth.controller");

const router = express.Router();

// ---------------------------- API ---------------------------- //

router.put("/updateProfile", verifyToken, controller.updateProfile);
router.post("/patient/login", controller.patientLogin);
router.post("/login", controller.findByEmail, controller.verifyPassword, controller.login);
router.put("/resetPassword", verifyToken, controller.handleNewPassword, controller.resetPassword);
router.get("/logout", controller.logout);
router.use(notFound);

module.exports = router;
