const express = require("express");
const router = express.Router();

const { read, update } = require("../common/crud");

const PillStore = require("../models").pillStore;
const controller = require('../controllers/PillStore.controller');

router.post("/", controller.addPillStore);
router.get("/all", read(PillStore)); // fetch All data
router.put("/:_id", update(PillStore));
router.delete("/:_id", controller.deletePillStore);

// Use when fetch some data
function pillStoreAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

module.exports = router;
