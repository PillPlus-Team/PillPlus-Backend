const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PillStorehouseSchema = new Schema(
    {
        _id: ObjectId,
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PillStore"
        },
        pill_list: [
            {
                pill_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Pill"
                },
                amount: {
                    type: Number, required: true, default: 0
                }
            }
        ]
    },
    {
        version: false
    }
);

module.exports = mongoose.model("PillStorehouse", PillStorehouseSchema, "PillStorehouse");