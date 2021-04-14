const express = require("express");
const { onlyAdmin } = require("../common/middleware");
const { notFound } = require("../common/middleware");
const { create, read, update, remove } = require("../common/crud");
const Pill = require("../models").pill;
const router = express.Router();

router.post("/", onlyAdmin, create(Pill));
router.get("/all" /*, pillAtPage*/, read(Pill)); // fetch All data
router.put("/:_id", update(Pill));
router.delete("/:_id", onlyAdmin, remove(Pill));

router.use(notFound);

// Use when fetch some data
function pillAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

module.exports = router;
