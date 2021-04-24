const db = require("./models");
const mongoose = db.mongoose;
const Invoice = db.invoice;

const io = require("socket.io")(process.env.SOCKET_PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket connected!!!");

  socket.on("test", (data) => {
    updateData(socket, Invoice);
  });

  socket.on("invoice", (data) => {
    const newInvoice = new Invoice({
      _id: new mongoose.Types.ObjectId(),
      ...data,
    });
    newInvoice.save((err, data) => {
      if (err) return socket.emit("invoce error", "can't add invoice");
    });
    updateData(socket, Invoice);
  });

  socket.on("disconnecting", () => {
    console.log("socket disconnecting...");
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

const updateData = (socket, model) => {
  model
    .find({}, "-createdAt -updatedAt")
    .populate("Pill")
    .exec((err, data) => {
      if (err) {
        console.log({ message: "Cannot get all accounts!!" });
      }
      socket.emit("update invoice", data);
    });
};
