const express = require("express");
const router = express.Router();

const db = require("../models");

const { 
  onlyAdmin,
  verifyToken
} = require("../common/middleware");

const {
  handlePassword,
  checkDuplicateEmailOrPhone
} = require("../common/actions");

const controller = require('../controllers/PillStore.controller');

// ---------------------------- API ---------------------------- //

router.get("/available/:_id", controller.getAvailablePillStores);

router.use(verifyToken);
router.get("/all", controller.getAllPillStores); // fetch All data

router.use(onlyAdmin);

router.post("/", 
            checkDuplicateEmailOrPhone(db.pillStore), 
            handlePassword,
            controller.CreateID,
            controller.addPillStore
          );
router.put("/:_id", controller.updatePillStore);
router.delete("/:_id", controller.deletePillStore);

module.exports = router;
