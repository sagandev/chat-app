import express from "express";
import * as dotenv from "dotenv";
const app = express();
import http from"http";
const server = http.createServer(app);
import mongo from"mongoose";
import { Server } from "socket.io";
const io  = new Server(server, {
  cors: {
    origin: "http://192.168.0.15:3000",
  },
});
import cors from"cors";
import chat from"./src/routes/chat.js";
import auth from"./src/routes/authorize.js";
import Message from "./src/schema/message.js"
import User from './src/schema/user.js'
import Chats from './src/schema/chats.js'
import moment from 'moment'
app.use(
  cors({
    origin: ["http://localhost:3000","http://192.168.0.15:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

mongo
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

io.on("connection", (socket) => {
  console.log(`${socket.id} user connected`)

  socket.on("join", async ({user, room}) => {
    const roomDB = await Chats.findById(room);
    if(!roomDB) return;
    const userDB = await User.findById(user.id)
    if(userDB.joinedChats.includes(room)){
     socket.join(room)
    } else {
      socket.emit("joinError", {error: "You dont't have permissions to read this chat"})
    }
  })
  socket.on("chat-history", async (room) => {
    const messages = await Message.find({roomId: room})
    if(!messages) return socket.emit('chat-empty', {messages: "Chat is empty"})
    socket.emit("chat-history-res", messages)
  })
  socket.on("new-message", async (data) => {
    let newMess = new Message({
      roomId: data.room,
      author: {
        id: data.user.id,
        name: data.user.username
      },
      message: data.message,
      date: moment().format('LLL'),
    });
    await newMess.save().then(res => {
      io.to(data.room).emit("message", res)
    }).catch((e) => {
    });
  })
});

app.use("/api", chat);
app.use("/auth", auth)
server.listen(3001, () => {
  console.log("listening on *:3001");
});
