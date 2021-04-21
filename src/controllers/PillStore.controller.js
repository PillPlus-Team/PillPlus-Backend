const db = require('../models');
const Pill = db.pill;
const PillStore = db.pillStore;
const PillStorehouse = db.pillStorehouse;

const bcrypt = require("bcrypt");

exports.addPillStore = async (req, res) => {
    const pillStore = await new PillStore({
        _id: new db.mongoose.Types.ObjectId(),
        ...req.body
    });

    pillStore.password = bcrypt.hashSync(req.body.password, 10);

    pillStore.save((err, user) => {
        if (err) 
            return res.status(500).send({ message: err });

        Pill.find({}, (err, pills) => {
            // const pill_list = []
            // pills.forEach(pill => {
            //     pill_list.push({
            //         pill_id: pill._id,
            //         amount: 0
            //     })
            // })

            // const pill_list = pills.map(pill => pill._id)

            // console.log(pill_list)
        
            const pillStorehouse = new PillStorehouse({
                _id: new db.mongoose.Types.ObjectId(),
                store: user._id,
                pill_list: pills
            })

            pillStorehouse.save((err, account) => {
                if (err)
                    return res.status(500).send({ message: err });
                return res.status(200).send({ message: "Pill Storehouse was successful!"}); 
            })

        });
    })
}

exports.deletePillStore = async (req, res) => {
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
