const db = require('../models');
const Queue = db.queue;
const Prescription = db.prescriptions;

// Create queue for patient
exports.createQueue = async (req, res, next) => {
    Queue.findOne({ name: "Prescription" }, async (err, queue) => {
        if (!queue) {
            return res.status(500).send({ message: "Cannot create queue for this prescription!!"});
        }
        const today = new Date();

        if (queue.updatedAt < new Date(today.getFullYear(), today.getMonth(), today.getDate()))
            queue.count = 0;

        let count = queue.count + 1;

        Queue.findOneAndUpdate({ _id: queue._id }, { count: count },(err, queue) => {
            console.log(queue.count)
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
        ...req.body,
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
