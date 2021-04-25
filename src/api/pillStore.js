const express = require("express");
const router = express.Router();

const { 
  onlyAdmin, 
  handlePassword
} = require("../common/middleware");

const controller = require('../controllers/PillStore.controller');

// ---------------------------- API ---------------------------- //

router.get("/all", controller.getAllPillStores); // fetch All data
router.get("/:_id", controller.getAvailablePillStores);

router.use(onlyAdmin);
router.post("/", 
            controller.checkDuplicateEmailOrPhone, 
            handlePassword,
            controller.CreateID,
            controller.addPillStore
          );
router.put("/:_id", controller.updatePillStore);
router.delete("/:_id", controller.deletePillStore);

// Use when fetch some data
function pillStoreAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

module.exports = router;
