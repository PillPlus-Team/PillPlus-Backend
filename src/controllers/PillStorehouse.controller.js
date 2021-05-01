const db = require("../models");
const PillStorehouse = db.pillStorehouse;

exports.updatePillStorehouse = (req, res) => {
  PillStorehouse.findOne(
    { _id: req.params._id },
    "-pill_list._id -__v -createdAt -updatedAt"
  )
    .populate("store", "-createdAt -updatedAt")
    .populate("pill_list.pill")
    .exec((err, Storehouse) => {
      if (err) return res.status(500).send({ message: "Cannot update!!" });

      const pillIndex = Storehouse.pill_list.findIndex(
        ({ pill }) => pill._id == req.body.pill_id
      );

      if (pillIndex !== -1) {
        Storehouse.pill_list[pillIndex].amount = req.body.amount;
      } else {
        return res.status(500).send({ message: "pill not found!" });
      }
      Storehouse.save((err, Storehouse) => {
        if (err) return res.status(500).send({ message: "Cannot update!!" });
        res.status(200).send(Storehouse.pill_list[pillIndex]);
      });
    });
};

exports.getPillStorehouse = (req, res) => {
  PillStorehouse.findOne(
    { _id: req.params._id },
    "-pill_list._id -createdAt -updatedAt"
  )
    .populate("store")
    .populate("pill_list.pill")
    .exec((err, Storehouse) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Cannot get PillStoreHouse !!" });
      console.log(Storehouse);
      res.status(200).send(Storehouse);
    });
};
