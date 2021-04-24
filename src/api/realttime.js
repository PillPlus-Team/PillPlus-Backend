const db = require("../models");
const mongoose = db.mongoose;
const Invoice = db.invoice;

const io = require("socket")(process.env.SOCKET_PORT, { serverClient: false });

io.on("connection", (socket) => {
  socket.emit("response", "socket connected!!!");

  socket.on("invoice", (data) => {
    const newInvoice = new Invoice({
      _id: new mongoose.Types.ObjectId(),
      ...data,
    });
    newInvoice.save((err, data) => {
      if (err)
        return socket.to(socket.id).emit("invoce error", "can't add invoice");
      socket.emit("invoice update", "invoice data updated!");
    });
  });

  socket.on("disconnecting", () => {
    console.log("socket disconnecting...");
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});
