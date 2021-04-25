const express = require("express");
const router = express.Router();

const { 
  onlyAdmin
} = require("../common/middleware");

const controller = require('../controllers/Invoice.controller');

// ---------------------------- API ---------------------------- //

router.get("/all", controller.getAllInvoices); // fetch All data
router.post("/:_id", controller.invoicePaid);

module.exports = router;
