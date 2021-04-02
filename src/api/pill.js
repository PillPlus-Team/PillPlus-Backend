const express = require("express");
const { onlyAdmin } = require("../common/middleware");
const { notFound } = require("../common/middleware");
const { create, read, update, remove } = require("../common/crud");
const Pill = require("../models/Pill");
const router = express.Router();

router.use(onlyAdmin);
router.post("/", create(Pill));
router.get("/all/:page", pillAtPage, read(Pill));
router.put("/:_id", update(Pill));
router.delete("/:_id", remove(Pill));

router.use(notFound);

function pillAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

module.exports = router;
