const db = require("../models");
const PillStorehouse = db.pillStorehouse;

exports.updatePillStorehouse = (res, req) => {
  PillStorehouse.findOne({ _id: req.params._id }, "-createdAt -updatedAt")
    .populate("store")
    .populate("pill_list.pill_id")
    .exec((err, Storehouse) => {
      if (err) return res.status(500).send({ message: "Cannot update!!" });
      Storehouse.pill_list.find(({ pill_id }) => pill_id === req.body.pill_id)
        .amount === req.body.amount;
      pillStorehouse.save((err, Storehouse) => {
        if (err) return res.status(500).send({ message: "Cannot update!!" });
        console.log(Storehouse);
        res.status(200).send(Storehouse);
      });
    });
};
