const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IDSchema = new Schema(
    {
        name: String,
        count: Number
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("ID", IDSchema, "IDs");