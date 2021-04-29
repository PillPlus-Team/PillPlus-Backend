const db = require('../models');
const ID = db.id;
const Pill = db.pill;
const PillStore = db.pillStore;
const Prescription = db.prescription;
const PillStorehouse = db.pillStorehouse;

// Add pill store
exports.CreateID = (req, res, next) => {
    ID.findOne({}, async (err, id) => {

        let count = id.count + 1;

        await ID.findOneAndUpdate({ _id: id._id }, { count: count }, (err, newID) => {
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

        Pill.find({}, async (err, pills) => {
            if (err) {
                return res.status(500).send({ message: "Cannot add pill store!" });
            }
        
            const pillStorehouse = await new PillStorehouse({
                _id: new db.mongoose.Types.ObjectId(),
                store: user._id,
                pill_list: pills
            })

            await pillStorehouse.save(async (err, account) => {
                if (err)
                    return res.status(500).send({ message: "Cannot create pill storehouse!" });

                await delete user._doc.createdAt;
                await delete user._doc.updatedAt;
                return res.status(200).send(user); 
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

// Get available pill stores by pills data
exports.getAvailablePillStores = (req, res) => {
    Prescription.findOne({ _id: req.params._id }, (err, inv) => {
        //const pills = inv.pills;

        PillStore.find({}, "-_id -createdAt -updatedAt", async (err, pillStore) => {
            if (err) {
                return res.status(500).send({ message: err });
            }

            var allPillStores = [];
            await pillStore.forEach(async doc => {
                await delete doc._doc.createdAt;
                await delete doc._doc.updatedAt;

                allPillStores.push({ 
                    ...doc,
                    status: true
                 });
            })

            return res.status(200).send(allPillStores);
        })
    })
}

// Update pill store
exports.updatePillStore = (req, res) => {
  
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
                        }, req.body
                        , { new: true }
                        , (err, pillStore) => {
                            if (err) 
                                return res.status(500).send({ message: err });
                    
                            console.log(pillStore)
                            res.status(200).send({
                                _id: req.params._id,
                                ID: pillStore.ID,
                                name: pillStore.name, 
                                pharmacy: pillStore.pharmacy,
                                location: pillStore.location,
                                lat: pillStore.lat,
                                lng: pillStore.lng,
                                email: pillStore.email,
                                phone: pillStore.phone,
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
