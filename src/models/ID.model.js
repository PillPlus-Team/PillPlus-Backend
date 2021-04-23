const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IDSchema = new Schema(
    {
        count: Number
    }
)

module.exports = mongoose.model("ID", IDSchema, "IDs");