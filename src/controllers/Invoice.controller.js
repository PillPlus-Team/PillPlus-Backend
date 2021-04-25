const db = require('../models');
const Invoice = db.invoice;

// Get all invoice
exports.getAllInvoices = (req, res) => {
    Invoice.find({}, "-createdAt -updatedAt", (err, docs) =>{
        if (err) {
            return res.status(500).send({ message: err });
        }
        return res.status(200).send(docs);
    })
}

exports.invoicePaid = (req, res) => {
    Invoice.findOneAndUpdate({ _id: req.params._id }, { paidStatus: true }, (err, invoice) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        return res.status(200).send({ message: "Paid successfully!" })
    })
}


