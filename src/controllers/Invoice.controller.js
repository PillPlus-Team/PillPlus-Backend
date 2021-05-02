const db = require("../models");
const Queue = db.queue;
const Invoice = db.invoice;
const PillStore = db.pillStore;
const Prescription = db.prescriptions;

// Create queue
exports.createQueue = (req, res, next) => {
  Queue.findOne({ name: "Invoice" }, async (err, queue) => {
    if (!queue) {
      return res
        .status(500)
        .send({ message: "Cannot create queue for this invoice!!" });
    }

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
  Invoice.find({})
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

      return res.status(200).send({ message: "Paid successfully!" });
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
      (err, pillStore) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        if (!pillStore) {
          return res.status(500).send({ message: "Cannot found pill store!!" });
        }

        Prescription.findOneAndUpdate(
          { _id: req.body._id },
          { status: true },
          (err, docs) => {
            if (err) {
              return res.status(500).send({ message: err });
            }

            const newInvoice = new Invoice({
              prescriptionID: req.body._id.toString(),
              identificationNumber: docs.identificationNumber,
              hn: docs.hn,
              name: docs.name,
              queueNo: docs.queueNo,
              doctor: docs.doctor,
              pillStore: pillStore,
              pills: docs.pills,
            });

            newInvoice.save((err, newInvoice) => {
              if (err) {
                return res.status(500).send({ message: err });
              }

              return res.status(200).send(newInvoice);
            });
          }
        );
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
      (err, pillStore) => {
        console.log(pillStore);
        if (err) {
          return res.status(500).send({ message: err });
        }

        if (!pillStore) {
          return res.status(500).send({ message: "Cannot found pill store!!" });
        }

        Invoice.findOneAndUpdate(
          { _id: req.user._id },
          { pillStore },
          { new: true }
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
            console.log(invoice);
            return res.status(200).send(invoice);
          });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
