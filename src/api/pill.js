const express = require("express");
const router = express.Router();

const { update } = require("../common/crud");
const { onlyAdmin } = require("../common/middleware");

const Pill = require("../models").pill;
const controller = require('../controllers/Pill.controller');

router.get("/all", controller.getAllPills); // fetch All data

router.use(onlyAdmin);
router.post("/", controller.addPill);
router.put("/:_id", controller.updatePill);
router.delete("/:_id", controller.deletePill);

// Use when fetch some data
function pillAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

module.exports = router;
