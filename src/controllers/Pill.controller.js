const db = require('../models');
const Pill = db.pill;
const PillStorehouse = db.pillStorehouse;

exports.addPill = (req, res) => {
    const pill = new Pill({
        _id: new db.mongoose.Types.ObjectId(),
        ...req.body
    });

    pill.save((err, pill) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        PillStorehouse.find({}, (err, storehouse) => {
            if (err) 
                return res.status(500).send({ message: err});

            storehouse.forEach(account => {
                const pill_list = account.pill_list;
                pill_list.push(pill);

                PillStorehouse.findOneAndUpdate(
                    { _id: account._id },
                    { pill_list: pill_list }
                ).catch(err => {
                    return res.status(500).send({ message: err });
                });
            });

            return res.status(200).send({ message: "Add pill successful"});
        })


    });
}

exports.deletePill = (req, res) => {
    Pill.deleteOne({
        _id: req.params._id
    }, (err, pill) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        PillStorehouse.find({}, (err, storehouse) => {
            if (err) 
                return res.status(500).send({ message: err});

            storehouse.forEach(account => {
                const pill_list = account.pill_list;
                
                for ( let i = 0; i < pill_list.length; i++ ) {
                    if (pill_list[i]._id == req.params._id) {
                        pill_list.splice(i, 1);
                        break;
                    }
                }
                PillStorehouse.findOneAndUpdate(
                    { _id: account._id },
                    { pill_list: pill_list }
                ).catch(err => {
                    return res.status(500).send({ message: err });
                });
            });

             return res.status(200).send({ message: "Delete pill successful"});
        })
    });
}