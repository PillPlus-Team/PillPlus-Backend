const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QueueSchema = new Schema(
    {
        name: String,
        count: Number
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

module.exports = mongoose.model("Queue", QueueSchema, "Queues");