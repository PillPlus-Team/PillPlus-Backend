const io = require("socket.io")(process.env.SOCKET_PORT, {
  cors: {
    origin: process.env.ORIGIN_CORS,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket connected!!! socekt ID:", socket.id);

  socket.on("join", (roomName) => {
    socket.join(roomName);
  });

  socket.on("room", (roomName) => {
    io.to(roomName).emit("message", roomName + "!!!");
  });

  socket.on("disconnecting", () => {
    console.log("socket disconnecting...");
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});
