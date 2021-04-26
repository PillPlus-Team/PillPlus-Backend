const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SocketSchema = new Schema({
  roomName: { type: String, required: true },
  socketID: [{ type: String, required: true }],
});

module.exports = mongoose.model("Socket", SocketSchema, "Sockets");
