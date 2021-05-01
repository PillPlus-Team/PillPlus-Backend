const express = require("express");
const router = express.Router();

const { onlyAdmin } = require("../common/middleware");

const controller = require('../controllers/Pill.controller');

router.use(onlyAdmin);

router.get("/all", controller.getAllPills); // fetch All data
router.post("/", controller.addPill);
router.put("/:_id", controller.updatePill);
router.delete("/:_id", controller.deletePill);

module.exports = router;
