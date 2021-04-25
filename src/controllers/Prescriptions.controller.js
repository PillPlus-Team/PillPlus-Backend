const db = require('../models');
const Queue = db.queue;
const Invoice = db.invoice;
const PillStore = db.pillStore;
const Prescription = db.prescriptions;

// Create queue for patient
exports.createQueue = async (req, res, next) => {
    Queue.findOne({ name: "Prescription" }, async (err, queue) => {

        let count = queue.count + 1;

        Queue.findOneAndUpdate({ _id: queue._id }, { count: count },(err, newQueue) => {
            console.log(newQueue);
        });

        let stringQueue = (count + 50000).toString();

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
    Prescription.find({ status: false }, "-createdAt -updatedAt", (err, docs) =>{
        if (err) {
            return res.status(500).send({ message: err });
        }
        return res.status(200).send(docs);
    })
}
