const { pill } = require("../models");
const db = require("../models");
const ID = db.id;
const Pill = db.pill;
const PillStore = db.pillStore;
const Prescription = db.prescriptions;
const PillStorehouse = db.pillStorehouse;

// Add pill store
exports.CreateID = (req, res, next) => {
  ID.findOne({ name: "PS" }, async (err, id) => {
    let stringID = id.count.toString();
    for (var i = 0; i < 4 - stringID.length; i++) {
      stringID = "0" + stringID;
    }
    req.body.ID = id.name + "1" + stringID;

    let count = id.count + 1;
    await ID.findOneAndUpdate({ _id: id._id }, { count: count });

    next();
  });
};

exports.addPillStore = async (req, res) => {
  const pillStore = await new PillStore({
    _id: new db.mongoose.Types.ObjectId(),
    ...req.body,
  });

  pillStore.save(async (err, pillStore) => {
    if (err) return res.status(500).send({ message: err });

    Pill.find({}, async (err, pills) => {
      if (err) {
        return res.status(500).send({ message: "Cannot add pill store!" });
      }

      const pillStorehouse = await new PillStorehouse({
        _id: new db.mongoose.Types.ObjectId(),
        store: pillStore._id,
        pill_list: pills.map((pill) => ({ pill: pill._id })),
      });

      await pillStorehouse.save(async (err, account) => {
        if (err)
          return res
            .status(500)
            .send({ message: "Cannot create pill storehouse!" });

        PillStore.findOneAndUpdate(
          { _id: pillStore._id },
          { pillStorehouse_id: account._id },
          { new: true }
        ).exec(async (err, update) => {
          if (err) return res.status(500).send({ message: err });

          await delete update._doc.password;
          await delete update._doc.pillStorehouse_id;
          await delete update._doc.coordinate;
          await delete update._doc.openingData;

          return res.status(200).send(update);
        });
      });
    });
  });
};

// Get all pill stores
exports.getAllPillStores = (req, res) => {
  PillStore.find(
    {},
    "-coordinate -openingData -avatarUri -createdAt -updatedAt",
    async (err, pillStore) => {
      if (err) {
        return res.status(500).send({ message: "Cannot get all accounts!!" });
      }

      return res.status(200).send(pillStore);
    }
  );
};

// Get available pill stores by pills data
exports.getAvailablePillStores = (req, res) => {
  Prescription.findOne({ _id: req.params._id }, "+pills._id", (err, doc) => {
    var pills = doc.pills;
    var availablePillStores = [];
    PillStore.find(
      { ID: { $ne: "PS1000" } },
      "-_id +openingStatus +pillStorehouse_id"
    ).then(async (pillStores) => {
      PillStorehouse.find({})
        .populate("store")
        .populate("pill_list.pill")
        .exec((err, storehouses) => {
          if (err)
            return res
              .status(500)
              .send({ message: "Cannot get available pill store!!" });
          for (store of storehouses) {
            let available = true;
            for (let pill of pills) {
              const store_available = store.pill_list.find(
                (pill_store) =>
                  toString(pill_store._id) === toString(pill._id) &&
                  pill_store.amount >= pill.amount
              );
              if (!store_available) {
                available = false;
                break;
              }
            }
            const getPillStore = pillStores.find(
              ({ pillStorehouse_id }) => pillStorehouse_id == store._id
            );
            if (available && getPillStore.openingStatus) {
              availablePillStores.push({
                ...getPillStore._doc,
                status: true,
              });
            } else {
              availablePillStores.push({
                ...getPillStore._doc,
                status: false,
              });
            }
          }

          return res.status(200).send(availablePillStores);
        });
    });
  });
};

// Update pill store
exports.updatePillStore = (req, res) => {
  PillStore.findOne({
    email: req.body.email,
  }).exec((err, pillStore) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!pillStore || pillStore._id == req.params._id) {
      PillStore.findOne({
        phone: req.body.phone,
      }).exec((err, pillStore) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        if (!pillStore || pillStore._id == req.params._id) {
          PillStore.findOneAndUpdate(
            {
              _id: req.params._id,
            },
            req.body,
            { new: true },
            (err, pillStore) => {
              if (err) return res.status(500).send({ message: err });

              console.log(pillStore);
              res.status(200).send(pillStore);
            }
          );
        }
      });
    } else {
      return res
        .status(400)
        .send({ message: "Failed! Email is already in use!" });
    }
  });
};

// Delete pill store
exports.deletePillStore = (req, res) => {
  PillStore.deleteOne(
    {
      _id: req.params._id,
    },
    (err, pill) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      PillStorehouse.deleteOne({
        store: req.params._id,
      }).catch((err) => {
        return res.status(500).send({ message: err });
      });

      return res.status(200).send({ message: "Deleted pill store account!" });
    }
  );
};
