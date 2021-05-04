const db = require("../models");
const Queue = db.queue;
const Invoice = db.invoice;
const PillStore = db.pillStore;
const Prescription = db.prescriptions;
const PillStorehouse = db.pillStorehouse;

// Create queue
exports.createQueue = (req, res, next) => {
  Queue.findOne({ name: "Invoice" }, async (err, queue) => {
    if (!queue) {
      return res
        .status(500)
        .send({ message: "Cannot create queue for this invoice!!" });
    }

    const today = new Date();

    if (
      queue.updatedAt <
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    )
      queue.count = 0;

    let count = queue.count + 1;

    Queue.findOneAndUpdate(
      { _id: queue._id },
      { count: count },
      (err, newQueue) => {}
    );

    req.body.queueNo = (count + 10000).toString();

    next();
  });
};

// Get all invoice
exports.getAllInvoices = (req, res) => {
  Invoice.find({ paidStatus: false }, "-createdAt -updatedAt")
    .populate("pillStore", "-_id")
    .exec((err, docs) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      return res.status(200).send(docs);
    });
};

// Invoice paid
exports.invoicePaid = (req, res) => {
  Invoice.findOneAndUpdate(
    { _id: req.params._id },
    { paidStatus: true },
    (err, invoice) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      return res.status(200).send(invoice);
    }
  );
};

// Select Pill store
exports.selectPillStore = (req, res) => {
  try {
    PillStore.findOne(
      {
        ID: req.body.pillStoreID,
      },
      "+pillStorehouse_id",
      (err, pillStore) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        if (!pillStore) {
          return res.status(500).send({ message: "Cannot found pill store!!" });
        }

        Prescription.findOne({ _id: req.body._id }, (err, prescription) => {
          if (err) {
            return res.status(500).send({ message: err });
          }

          PillStorehouse.findOne({ _id: pillStore.pillStorehouse_id }, "+_id")
            .populate("pill_list.pill")
            .exec((err, storehouse) => {
              if (err)
                return res
                  .status(500)
                  .send({ message: "Cannot select this pill store!!" });

              var pillCost = [];
              const serviceCharge = 50;
              var totalPay = serviceCharge;

              prescription.pills.forEach((doc) => {
                const pillIndex = storehouse.pill_list.findIndex(
                  ({ pill }) => pill.sn == doc.sn
                );

                var totalPrice = 0;
                if (pillIndex !== -1) {
                  storehouse.pill_list[pillIndex].amount -= doc.amount;
                  totalPrice =
                    storehouse.pill_list[pillIndex].pill.price * doc.amount;
                  totalPay += totalPrice;
                } else {
                  return res.status(500).send({ message: "pill not found!" });
                }

                pillCost.push({
                  ...doc._doc,
                  totalPrice,
                });
              });

              Prescription.findOneAndUpdate(
                { _id: req.body._id },
                { status: true },
                (err, prescription) => {
                  if (err) {
                    return res.status(500).send({ message: err });
                  }

                  storehouse.save((err, storehouse) => {
                    if (err)
                      return res
                        .status(500)
                        .send({ message: "Cannot select this pill store!!" });

                    const newInvoice = new Invoice({
                      prescriptionID: req.body._id.toString(),
                      identificationNumber: prescription.identificationNumber,
                      hn: prescription.hn,
                      name: prescription.name,
                      queueNo: prescription.queueNo,
                      doctor: prescription.doctor,
                      pillStore: pillStore,
                      pills: pillCost,
                      totalPay,
                      serviceCharge,
                    });

                    newInvoice.save(async (err, newInvoice) => {
                      if (err) {
                        return res.status(500).send({ message: err });
                      }

                      await delete newInvoice._doc.paidStatus;
                      await delete newInvoice._doc.createdAt;
                      await delete newInvoice._doc.updatedAt;

                      return res.status(200).send(newInvoice);
                    });
                  });
                }
              );
            });
        });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// Update invoice
exports.updateInvoice = (req, res) => {
  try {
    PillStore.findOne(
      {
        ID: req.body.pillStoreID,
      },
      (err, newPillStore) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        if (!newPillStore) {
          return res.status(500).send({ message: "Cannot found pill store!!" });
        }

        Invoice.findOneAndUpdate(
          { _id: req.user._id },
          { pillStore: newPillStore }
        )
          .populate("pillStore")
          .exec((err, invoice) => {
            if (err) {
              return res.status(500).send({ message: err });
            }

            if (!invoice) {
              return res
                .status(500)
                .send({ message: "Cannot found this invoice!!" });
            }

            PillStorehouse.findOne({ store: invoice.pillStore._id }, "+_id")
              .populate("pill_list.pill")
              .exec((err, storehouse) => {
                if (err)
                  return res
                    .status(500)
                    .send({ message: "Cannot select this pill store!!" });

                invoice.pills.forEach((doc) => {
                  const pillIndex = storehouse.pill_list.findIndex(
                    ({ pill }) => pill.sn == doc.sn
                  );

                  if (pillIndex !== -1) {
                    storehouse.pill_list[pillIndex].amount += doc.amount;
                  } else {
                    return res.status(500).send({ message: "pill not found!" });
                  }
                });
                storehouse.save((err, storehouse) => {
                  if (err)
                    return res
                      .status(500)
                      .send({ message: "Cannot select this pill store!!" });
                });
              });

            PillStorehouse.findOne({ store: newPillStore._id }, "+_id")
              .populate("pill_list.pill")
              .exec((err, storehouse) => {
                if (err)
                  return res
                    .status(500)
                    .send({ message: "Cannot select this pill store!!" });

                invoice.pills.forEach((doc) => {
                  const pillIndex = storehouse.pill_list.findIndex(
                    ({ pill }) => pill.sn == doc.sn
                  );

                  if (pillIndex !== -1) {
                    storehouse.pill_list[pillIndex].amount -= doc.amount;
                  } else {
                    return res.status(500).send({ message: "pill not found!" });
                  }
                });
                storehouse.save((err, storehouse) => {
                  if (err)
                    return res
                      .status(500)
                      .send({ message: "Cannot select this pill store!!" });
                });
              });

            delete invoice._doc.createdAt;
            delete invoice._doc.updatedAt;
            invoice.pillStore = newPillStore;
            return res.status(200).send(invoice);
          });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// For Pill Store
exports.getListCustomers = (req, res) => {
  Invoice.find(
    { pillStore: req.user._id, paidStatus: true },
    "-createdAt -updatedAt -pillStore -serviceCharge -totalPay -hn +dispenseDate"
  )
    .then((invoices) => {
      invoices = invoices.filter((invoice) => !invoice.dispenseDate);
      return res.status(200).send(invoices);
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
};

exports.dispensePill = (req, res) => {
  Invoice.findOne({ _id: req.params._id })
    .then((invoice) => {
      invoice.dispenseDate = new Date();
      invoice.save().then(() => {
        return res.status(200).send({ message: "Dispensed pill successful!!" });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err });
    });
};

// Statements
exports.getAllStatements = (req, res) => {
  let invoiceList = {};
  Invoice.find({
    dispenseDate: {
      $gte: new Date(req.body.year, req.body.month, 1),
      $lt: new Date(req.body.year, req.body.month + 1, 1),
    },
  })
    .populate("pillStore")
    .exec((err, invoices) => {
      if (err)
        return res
          .status(500)
          .send({ message: "can't get Invoice by this ID!" });

      if (invoices) {
        for (invoice of invoices) {
          if (!invoiceList[invoice.pillStore.name]) {
            invoiceList[invoice.pillStore.name] = {
              ...invoice.pillStore,
              balanced: invoice.serviceCharge + invoice.totalPay,
            };
          } else {
            invoiceList[invoice.pillStore.name].balanced +=
              invoice.serviceCharge + invoice.totalPay;
          }
        }
      }
      return res.status(200).send(invoiceList);
    });
};

exports.getStatements = (req, res) => {
  Invoice.find({
    pillStore: req.user._id,
    dispenseDate: {
      $gte: new Date(req.body.year, req.body.month, 1),
      $lt: new Date(req.body.year, req.body.month + 1, 1),
    },
  })
    .populate("pillStore")
    .exec((err, invoice) => {
      if (err)
        return res
          .status(500)
          .send({ message: "can't get Invoice by this ID!" });
      return res.status(200).send(invoice);
    });
};
