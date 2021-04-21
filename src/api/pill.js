const express = require("express");
const router = express.Router();

const { read, update } = require("../common/crud");

const Pill = require("../models").pill;
const controller = require('../controllers/Pill.controller');

router.post("/", controller.addPill);
router.get("/all", read(Pill)); // fetch All data
router.put("/:_id", update(Pill));
router.delete("/:_id", controller.deletePill);

// Use when fetch some data
function pillAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

module.exports = router;
