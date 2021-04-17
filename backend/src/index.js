require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const OSC = require('osc-js');
const dgram = require('dgram');
var osc = require("osc")

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});



mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true
  }
);

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use(require("./routes"));
server.listen(3333);

var udpPort = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: 57121,
  metadata: true
});







io.on("connection", (socket) => {
  console.log(`New client connected : ${socket.id}`);

  udpPort.on("message", function (oscMsg, timeTag, info) {
    console.log("Remote info is: ", oscMsg);
    socket.emit("FromAPI", oscMsg);
  });

  udpPort.open();

  //interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    //clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  //socket.emit("FromAPI", response);
};