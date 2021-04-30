const express = require("express");
const router = express.Router();

const controller = require("../controllers/PillStorehouse.controller");

router.put("/:_id", controller.updatePillStorehouse);

module.exports = router;
