const db = require('../models');
const Prescriptions = db.prescriptions;

exports.receivePrescriptions = (req, res) => {
    const prescriptions = new Prescriptions({
        _id: new db.mongoose.Types.ObjectId,
        ...req.body
    })

    prescriptions.save(); 
}


exports.getPrescriptions = (req, res) => {
    Prescriptions.find({}, (err, docs) =>{
        if (err) {
            return res.status(500).send({ message: err });
        }
        return res.status(200).send(docs);
    })
}
