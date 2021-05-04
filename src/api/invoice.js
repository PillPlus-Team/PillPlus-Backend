const express = require("express");
const router = express.Router();

const {
  forStaff,
  forCashier,
  forPatient,
  forPillStore,
} = require("../common/middleware");

const controller = require("../controllers/Invoice.controller");

// ---------------------------- API ---------------------------- //

// ----------------------- For Pill Store ---------------------- //
router.get("/listCustomers", forPillStore, controller.getListCustomers);
router.put("/dispensePill/:_id", forPillStore, controller.dispensePill);
router.get("/statements", forPillStore, controller.getStatements);

// ----------------------- For Patients ------------------------ //
router.put("/update", forPatient, controller.updateInvoice);

// ------------------------ For Hospital ----------------------- //
router.get("/pillStoreStatements", forCashier, controller.getAllStatements);
router.post(
  "/selectPillStore",
  forStaff,
  controller.createQueue,
  controller.selectPillStore
);

router.get("/", forCashier, controller.getAllInvoices); // fetch All data
router.post("/:_id", forCashier, controller.invoicePaid);

module.exports = router;
