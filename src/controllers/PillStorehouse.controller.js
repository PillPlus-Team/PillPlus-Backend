const db = require("../models");
const PillStorehouse = db.pillStorehouse;

exports.updatePillStorehouse = (req, res) => {
  PillStorehouse.findOne({ _id: req.params._id }, "-createdAt -updatedAt")
    .populate("store")
    .populate("pill_list.pill_id")
    .exec((err, Storehouse) => {
      if (err) return res.status(500).send({ message: "Cannot update!!" });
      console.log(Storehouse);
      const pillIndex = Storehouse.pill_list.findIndex(
        ({ pill_id }) => pill_id._id == req.body.pill_id
      );
      if (pillIndex !== -1) {
        Storehouse.pill_list[pillIndex].amount = req.body.amount;
      } else {
        return res.status(500).send({ message: "pill not found!" });
      }
      Storehouse.save((err, Storehouse) => {
        if (err) return res.status(500).send({ message: "Cannot update!!" });
        console.log(Storehouse);
        res.status(200).send(Storehouse);
      });
    });
};

exports.getPillStorehouse = (req, res) => {
  PillStorehouse.findOne({ _id: req.params._id }, "-createdAt -updatedAt")
    .populate("store")
    .populate("pill_list.pill_id")
    .exec((err, Storehouse) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Cannot get PillStoreHouse !!" });
      console.log(Storehouse);
      res.status(200).send(Storehouse);
    });
};
