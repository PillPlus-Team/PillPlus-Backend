const express = require("express");
const { create, read, update, remove } = require("../common/crud");
const { onlyAdmin, notFound } = require("../common/middleware");
const PillStore = require("../models").pillStore;
const router = express.Router();

const controller = require('../controllers/PillStore.controller');

router.post("/", onlyAdmin, controller.addPillStore);
router.get("/all" /*, pillStoreAtPage*/, read(PillStore)); // fetch All data
router.put("/:_id", onlyAdmin, update(PillStore));
router.delete("/:_id", onlyAdmin, controller.deletePillStore);

router.use(notFound);

// Use when fetch some data
function pillStoreAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

module.exports = router;
