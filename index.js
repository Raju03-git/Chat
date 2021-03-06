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


let users = {};
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    const user = { username: data.username, room: data.room };
    users[socket.id] = user;
    socket.join(data.room);
    console.log(`User ${data.username} with ID: ${socket.id} joined room: ${data.room}`);

    const join_message = this.formatMesssage(user.room, user.username, 'joined', 'user_activity');
    socket.to(data.room).emit("user_joined", join_message);
    socket.to(data.room).emit("active_users", users);
  });

  socket.on("send_message", async (data) => {
    let clientInstance = new message(data);
    clientInstance.save();
    let uniqueMessages = await this.findAllMessages(data.room);
    console.log('<>uniqueMessages<>', uniqueMessages);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    let user = users[socket.id];
    if (user) {

      const left_message = this.formatMesssage(user.room, user.username, 'left', 'user_activity');
      socket.to(user.room).emit("user_left", left_message);
    }
  });
});

exports.formatMesssage = async (room, username, status, type) => {
  let user_message = { room: room, message: username + " " + status };
  if (type == 'user_activity')
    user_message[type] = 'user_activity';
  return user_message;
};

exports.findAllMessages = async (roomId) => {
  return await message.find({ room: roomId });
    // .then(async (result) => {
    //   console.log('<><>', result);
    //   return result;
    // }).catch(err => {
    //   throw err;
    // });
  // return 'user_message';
};


/**
 * Database connection
 */
db.connect();

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
