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

  socket.on("chat message", async (msg, user) => {
    console.log("message: " + msg);
    console.log(msg.sender)
    let newMess = new Message({
      author: {
        username: msg.sender.username,
        avatar: msg.sender.avatar,
        id: msg.sender._id,
        avatarColor: msg.sender.avatarColor,
        sex: msg.sender.sex,
        role: msg.sender.role,
      },
      message: msg.value,
      date: new Date().now,
    });
    await newMess.save().catch((e) => {
      console.log(e);
    });
    io.emit("chat message", msg);
  });
});

app.use("/api", chat);
app.use("/auth", auth)
server.listen(3001, () => {
  console.log("listening on *:3001");
});
