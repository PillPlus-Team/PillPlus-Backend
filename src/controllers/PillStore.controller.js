const db = require('../models');
const ID = db.id;
const Pill = db.pill;
const PillStore = db.pillStore;
const PillStorehouse = db.pillStorehouse;

// Add pill store
exports.CreateID = (req, res, next) => {
    ID.findOne({}, (err, id) => {
        if(!id) {
            const newID = new ID({ count: 1 });
            newID.save((err, newID) => {
                id = newID;
            });
        }

        console.log(id)
        let count = id.count + 1;

        ID.findOneAndUpdate({ _id: id._id }, { count: count },(err, newID) => {
            console.log(newID)
        });

        let stringID = count.toString();
        for (var i = 0; i < 8 - stringID.length; i++) {
            stringID = "0" + stringID;
        }

        req.body.ID = "PS100" + stringID;

        next();
    })
}


exports.addPillStore = async (req, res) => {
    const pillStore = await new PillStore({
        _id: new db.mongoose.Types.ObjectId(),
        ...req.body
    });

    pillStore.save((err, user) => {
        if (err) 
            return res.status(500).send({ message: err });

        Pill.find({}, (err, pills) => {
            if (err) {
                return res.status(500).send({ message: "Cannot add pill store!" });
            }
        
            const pillStorehouse = new PillStorehouse({
                _id: new db.mongoose.Types.ObjectId(),
                store: user._id,
                pill_list: pills
            })

            pillStorehouse.save((err, account) => {
                if (err)
                    return res.status(500).send({ message: "Cannot create pill storehouse!" });

                const { _id, ID, name, pharmacy, location, email, phone } = user;
                return res.status(200).send({ _id, ID, name, pharmacy, location, email, phone }); 
            })

        });
    })
}

// Check duplicate Email and Phone
exports.checkDuplicateEmailOrPhone = (req, res, next) => {
    // Username
    PillStore.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
  
        if (user) {
            res.status(400).send({ message: "Failed! Email is already in use!"});
            return;
        }
  
        // Email
        PillStore.findOne({
            phone: req.body.phone
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
  
            if (user) {
                res.status(400).send({ message: "Failed! Phone is already in use!"});
                return;
            }
  
            next();
        });
  
    });
  };

// Get all pill stores
exports.getAllPillStores = (req, res) => {
    PillStore.find({}, "-createdAt -updatedAt", (err, pillStore) => {
        if (err) {
            return res.status(500).send({ message: "Cannot get all accounts!!" });
        }
        return res.status(200).send(pillStore);
    })
}

// Update pill store
exports.updatePillStore = (req, res) => {
    const { name, pharmacy, location, email, phone } = req.body;
  
    PillStore.findOne({
        email: req.body.email
    }).exec((err, pillStore) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (!pillStore || pillStore._id == req.params._id) {

            PillStore.findOne({
                phone: req.body.phone
            }).exec((err, pillStore) => {
                if (err) {
                    return res.status(500).send({ message: err });
                }

                if(!pillStore || pillStore._id == req.params._id) {

                    PillStore.findOneAndUpdate({
                        _id: req.params._id
                        }, req.body)
                        .exec((err, pillStore) => {
                            if (err) 
                                return res.status(500).send({ message: err });
                    
                            res.status(200).send({
                                _id: req.params._id,
                                ID: pillStore.ID,
                                name,
                                pharmacy,
                                location,
                                email,
                                phone,
                                // accessToken: token, // use cookie instead
                            });
                        }
                    );

                }

            })
    
        } else {
            return res.status(400).send({ message: "Failed! Email is already in use!"})
        }
    })
}

// Delete pill store
exports.deletePillStore = (req, res) => {
    PillStore.deleteOne({
        _id: req.params._id
    }, (err, pill) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        PillStorehouse.deleteOne({
            store: req.params._id
        }).catch(err => {
            return res.status(500).send({ message: err });
        })

        return res.status(200).send({ message: "Deleted pill store account!" });
    });
}
