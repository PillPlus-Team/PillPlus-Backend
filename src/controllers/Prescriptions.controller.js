const db = require('../models');
const Queue = db.queue;
const Invoice = db.invoice;
const PillStore = db.pillStore;
const Prescription = db.prescriptions;

// Create queue for patient
exports.createQueue = (req, res, next) => {
    Queue.findOne({}, async (err, queue) => {
        if(!queue) {
            const newQueue = await new Queue({ count: 10001 });
            await newQueue.save((err, newQueue) => {
                if (err) {
                    res.status(500).send({ message: err})
                }
                queue = newQueue;
            });
        }

        let count = queue.count;

        Queue.findOneAndUpdate({ _id: queue._id }, { count: count + 1 },(err, newQueue) => {
        });

        let stringQueue = count.toString();
        for (var i = 0; i < 6 - stringQueue.length; i++) {
            stringQueue = "0" + stringQueue;
        }

        req.body.queueNo = stringQueue;

        next();
    })
}

// Received prescription from hospital
exports.receivePrescriptions = (req, res) => {
    const prescription = new Prescription({
        _id: new db.mongoose.Types.ObjectId,
        ...req.body
    })

    prescription.save((err, docs) => {
        return res.status(200).send(docs);
    }); 
}


exports.getPrescriptions = (req, res) => {
    Prescription.find({}, "-createdAt -updatedAt", (err, docs) =>{
        if (err) {
            return res.status(500).send({ message: err });
        }
        return res.status(200).send(docs);
    })
}

exports.selectPillStore = (req, res) => {
    PillStore.findOne(
        {
            ID: req.body.pillStoreID
        }, (err, pillStore) => {
            if (err) {
                return res.status(500).send({ message: err });
            }

            console.log(pillStore)

            Invoice.findOneAndUpdate(
                { prescriptionID: req.body._id.toString() },
                {
                    pillStoreID: pillStore.ID,
                    pillStorePharmacy: pillStore.pharmacy,
                    pillStoreLocation: pillStore.location,
                },
                { new: true },
                (err, invoice) => {
                    
                    if (err) {
                        return res.status(500).send({ message: err });
                    }

                    if (invoice) {
                        return res.status(200).send(invoice);
                    }

                    console.log(invoice)

                    Prescription.findOneAndUpdate({ _id: req.body._id }, { status: true }, (err, docs) => {
                        if (err) {
                            return res.status(500).send({ message: err });
                        }

                        console.log(docs);
                            
                        const newInvoice = new Invoice({
                            _id: new db.mongoose.Types.ObjectId(),
                            prescriptionID: req.body._id.toString(),
                            identificationNumber: docs.identificationNumber,
                            hn: docs.hn,
                            name: docs.name,
                            queueNo: docs.queueNo,
                            doctor: docs.doctor,
                            pillStoreID: pillStore.ID,
                            pillStorePharmacy: pillStore.pharmacy,
                            pillStoreLocation: pillStore.location,
                            pills: docs.pills,
                        });
                        
                        newInvoice.save((err, newInvoice) => {
                            if (err) {
                                return res.status(500).send({ message: err });
                            }
            
                            return res.status(200).send(newInvoice);
                        })
                    });

                }
            )
        }
    )
}
