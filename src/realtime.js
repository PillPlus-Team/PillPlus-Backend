const sockets = require("./models").socket;

const io = require("socket.io")(process.env.SOCKET_PORT, {
  cors: {
    origin: process.env.ORIGIN_CORS,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket connected!!! socekt ID:", socket.id);

  socket.on("join", (roomName) => {
    sockets.findOne({ roomName: roomName }, (err, data) => {
      if (err) {
        socket.emit("err", "invalid name room");
      }
      if (!data) {
        const newSocket = new sockets({
          roomName: roomName,
          socketID: [socket.id],
        });
        newSocket.save((err, data) => {
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

  socket.on("room", (roomName) => {
    sockets.findOne({ roomName: roomName }, (err, data) => {
      if (err) socket.emit("err", "invalid name room");
      if (!data || !data.socketID.includes(socket.id))
        socket.emit("err", "access deny");
      else if (data.socketID.includes(socket.id))
        io.to(roomName).emit("message", roomName + "!!!");
    });
  });

  socket.on("leave", (roomName) => {
    sockets.findOne({ roomName: roomName }, (err, data) => {
      if (data) {
        data.socketID.pull(socket.id);
        data.save();
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});
