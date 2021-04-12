const express = require("express");
const { create, read, update, remove } = require("../common/crud");
const { onlyAdmin, notFound } = require("../common/middleware");
const PillStore = require("../models").pillStore;
const router = express.Router();

router.post("/", onlyAdmin, create(PillStore));
router.get("/all/:page" /*, pillStoreAtPage*/, read(PillStore)); // fetch All data
router.put("/:id", onlyAdmin, update(PillStore));
router.delete("/:id", onlyAdmin, remove(PillStore));

router.use(notFound);

// Use when fetch some data
function pillStoreAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

module.exports = router;
