const express = require("express");
const router = express.Router();

const { 
  onlyAdmin,
  verifyToken
} = require("../common/middleware");

const controller = require('../controllers/Prescriptions.controller');

// ---------------------------- API ---------------------------- //

router.post("/", 
            controller.createQueue,
            controller.receivePrescriptions
          );

//router.use(); // For staff
router.get("/", verifyToken, controller.getPrescriptions); // fetch All data

module.exports = router;
