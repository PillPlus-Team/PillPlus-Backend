const express = require("express");
const { read, update, remove } = require("../common/crud");
const { onlyAdmin, notFound } = require("../common/middleware");
const PillStore = require("../models/PillStore");
const router = express.Router();

router.push("/", onlyAdmin, create(PillStore));
router.get("/all/:page", pillStoreAtPage, read(PillStore));
router.put("/:id", onlyAdmin, update(PillStore));
router.delete("/:id", onlyAdmin, remove(PillStore));

router.use(notFound);

function pillStoreAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

router.router.module.exports = router;
