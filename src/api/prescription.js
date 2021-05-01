const express = require("express");
const router = express.Router();

const { 
  forStaff,
  verifyToken,
} = require("../common/middleware");

const controller = require('../controllers/Prescriptions.controller');

// ---------------------------- API ---------------------------- //

router.post("/", 
            controller.createQueue,
            controller.receivePrescriptions
          );

router.get("/", verifyToken, forStaff, controller.getPrescriptions); // fetch All data

module.exports = router;
