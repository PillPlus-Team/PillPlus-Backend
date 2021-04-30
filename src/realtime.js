const sockets = require("./models").socket;
const { instrument } = require("@socket.io/admin-ui");

const io = require("socket.io")(process.env.SOCKET_PORT, {
  cors: {
    origin: [ `${process.env.ORIGIN_CORS}`, "https://admin.pillplus.store"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket connected!!! socekt ID:", socket.id);

  socket.on("join", async (roomName) => {
    await sockets.findOne({ roomName: roomName }, async (err, data) => {
      if (err) {
        socket.emit("err", "invalid name room");
      }
      if (!data) {
        const newSocket = new sockets({
          roomName: roomName,
          socketID: [socket.id],
        });
        await newSocket.save((err, data) => {
          if (err) socket.emit("err", "can't join room please try again");
          console.log(data);
        });
      } else {
        if (!data.socketID.includes(socket.id)) {
          data.socketID.push(socket.id);
          data.save();
        }
      }
    });
    socket.join(roomName);
  });

  socket.on("room", async (roomName) => {
    await sockets.findOne({ roomName: roomName }, (err, data) => {
      if (err) socket.emit("err", "invalid name room");
      if (!data || !data.socketID.includes(socket.id))
        socket.emit("err", "access deny");
      else if (data.socketID.includes(socket.id))
        io.to(roomName).emit("message", roomName + "!!!");
    });
  });

  socket.on("leave", async (roomName) => {
    await sockets.findOne({ roomName: roomName }, async (err, data) => {
      if (data) {
        data.socketID.pull(socket.id);
        await data.save();
        socket.leave(roomName);
      }
    });
  });

  socket.on("disconnect", async () => {
    console.log("socket disconnected");
    await sockets.find({ socketID: socket.id }, (err, datas) => {
      if (datas) {
        datas.map(async (data) => {
          data.socketID.pull(socket.id);
          await data.save();
        });
      }
    });
  });
});

instrument(io, {
  auth: {
    type: "basic",
    username: process.env.SOCKET_USERNAME,
    password: process.env.SOCKET_PASSWORD,
  },
});
