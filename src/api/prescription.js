const express = require("express");
const router = express.Router();

const { 
  onlyAdmin
} = require("../common/middleware");

const controller = require('../controllers/Prescriptions.controller');

// ---------------------------- API ---------------------------- //

router.get("/all", controller.getPrescriptions); // fetch All data
router.post("/", 
            controller.createQueue,
            controller.receivePrescriptions
          );
router.post("/selectPillStore", controller.selectPillStore);

module.exports = router;
