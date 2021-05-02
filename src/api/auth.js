const express = require("express");

const { 
    verifyToken,
    forHospital,
    forPillStore
} = require("../common/middleware");

const controller = require("../controllers/Auth.controller");

const db = require("../models");

const router = express.Router();

// ---------------------------- API ---------------------------- //

// Login
router.post("/login", 
        controller.findByEmail(db.user), 
        controller.verifyPassword, 
        controller.login(db.user)
);
router.post("/patient/login", controller.patientLogin);
router.post("/pillStore/login", 
        controller.findByEmail(db.pillStore), 
        controller.verifyPassword, 
        controller.login(db.pillStore)
);

// Logout
router.get("/logout", controller.logout);

// Verify Token
router.use(verifyToken);

// Update profile
router.put("/updateProfile",
                controller.updateProfile
            );

// Reset password
router.put("/resetPassword",
                controller.handleNewPassword, 
                controller.resetPassword
            );

module.exports = router;
