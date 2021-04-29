const express = require("express");
const router = express.Router();

const { 
  onlyAdmin
} = require("../common/middleware");

const controller = require('../controllers/Invoice.controller');

// ---------------------------- API ---------------------------- //

// For staff
router.post("/selectPillStore", controller.createQueue, controller.selectPillStore);
// For cashier
router.get("/", controller.getAllInvoices); // fetch All data
router.put("/update", controller.updateInvoice);
router.post("/:_id", controller.invoicePaid);

module.exports = router;
