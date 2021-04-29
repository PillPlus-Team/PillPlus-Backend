const express = require("express");
const { notFound, verifyToken } = require("../common/middleware");
const controller = require("../controllers/auth.controller");

const db = require("../models");

const router = express.Router();

// ---------------------------- API ---------------------------- //

// Login
router.post("/login", 
                controller.findByEmail(db.user), 
                controller.verifyPassword, 
                controller.login
            );

router.post("/patient/login", controller.patientLogin);

// router.post("/pillStore/login", controller.pillStoreFindByEmail, controller.verifyPassword, controller.pillStoreLogin);

// Verify Token
router.use(verifyToken);

// Update profile
router.put("/updateProfile",
                controller.updateProfile(db.user)
            );

router.put("/pillStore/updateProfile",
                controller.updateProfile(db.pillStore)
            );

// Reset password
router.put("/resetPassword",
                controller.handleNewPassword, 
                controller.resetPassword(db.user)
            );

router.put("/pillStore/resetPassword",
                controller.handleNewPassword, 
                controller.resetPassword(db.pillStore)
            );

// Logout
router.get("/logout", controller.logout);
router.use(notFound);

module.exports = router;
