const express = require("express");
const router = express.Router();

const {
  forStaff,
  forCashier,
  forPatient
} = require("../common/middleware");

const controller = require('../controllers/Invoice.controller');

// ---------------------------- API ---------------------------- //

router.put("/update", forPatient, controller.updateInvoice);
// For staff
router.post("/selectPillStore", forStaff, controller.createQueue, controller.selectPillStore);
// For cashier
router.use(forCashier);
router.get("/", controller.getAllInvoices); // fetch All data
router.post("/:_id", controller.invoicePaid);

module.exports = router;
