const express = require("express");
const router = express.Router();

const controller = require("../controllers/PillStorehouse.controller");

router.get("/", controller.getPillStorehouse);
router.put("/:_id", controller.updatePillStorehouse);

module.exports = router;
