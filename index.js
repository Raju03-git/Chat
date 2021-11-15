const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const db = require('./db');
const message = require('./schema/message');
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Keboli REST API');
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log('');
    console.log('');
    console.log('<>Joined<>');
    console.log('');
    console.log('');
    socket.join(data.room);
    console.log(`User ${data.username} with ID: ${socket.id} joined room: ${data}`);
    const userJoinedMsg = `${data.username} has joined the chat`;
    const chatDet = { room: data.room, author: 'chatBot', message: userJoinedMsg, time: '13:3' }
    console.log('<><>chatDet<><>', chatDet);
    socket.to(data.room).emit("user_joined", chatDet);
    console.log('<><>chatDet<><>', chatDet);
  }); 

  socket.on("send_message", (data) => { 
    console.log('<><>send_message<><>', data);
    let clientInstance = new message(data);
    clientInstance.save();
    let uniqueMessages = message.find({});
    console.log('<>uniqueMessages<>',uniqueMessages)
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", (data) => {
    console.log('<><>data<><>', data);
    console.log("User Disconnected", socket.id);
    const userJoinedMsg = `${data.username} has been left from the chat`;
    const chatDet = { room: data.room, author: 'chatBot', message: userJoinedMsg, time: '13:3' }
    console.log('<><>chatDet<><>', chatDet);
    socket.to(data.room).emit("user_left", chatDet);
    console.log('<><>chatDet<><>', chatDet);
  });
});

/**
 * Database connection
 */
db.connect();

server.listen(3333, () => {
  console.log("SERVER RUNNING");
});
