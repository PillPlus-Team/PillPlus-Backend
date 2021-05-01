const express = require("express");

const { 
    verifyToken,
    forHospital,
    forPatient,
    forPillStore
} = require("../common/middleware");

const controller = require("../controllers/auth.controller");

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
                forHospital,
                controller.updateProfile(db.user)
            );

router.put("/pillStore/updateProfile",
                forPillStore,
                controller.updateProfile(db.pillStore)
            );

// Reset password
router.put("/resetPassword",
                forHospital,
                controller.handleNewPassword, 
                controller.resetPassword(db.user)
            );

router.put("/pillStore/resetPassword",
                forPillStore,
                controller.handleNewPassword, 
                controller.resetPassword(db.pillStore)
            );

module.exports = router;
