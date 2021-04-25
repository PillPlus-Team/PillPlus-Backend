const db = require('../models');
const Pill = db.pill;
const PillStorehouse = db.pillStorehouse;

// Add pill
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

            return res.status(200).send(pill);
        })


    });
}

// Get all pills
exports.getAllPills = (req, res) => {
    Pill.find({}, "-createdAt -updatedAt", (err, pillStore) => {
        if (err) {
            return res.status(500).send({ message: "Cannot get all accounts!!" });
        }
        return res.status(200).send(pillStore);
    })
}

// Update pill store
exports.updatePill = (req, res) => {

    Pill.findOne({
        sn: req.body.sn
    }).exec((err, pill) => {
        if (!pill || pill._id == req.params._id) {
            Pill.findOneAndUpdate({
                _id: req.params._id
                }, req.body
                , { new: true }
                , (err, pill) => {
                    if (err) 
                        return res.status(500).send({ message: err });
                    return res.status(200).send(pill);
            })
        } else {
            return res.status(400).send({ message: "Failed! SN is already in use!"})
        }
    })
  
}

// Delete pill
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