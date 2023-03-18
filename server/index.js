import express from "express";
import * as dotenv from "dotenv";
import http from"http");
const server = http.createServer(app);
import mongo from"mongoose");
import { Server } from"socket.io");
const io  = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
import cors from"cors";
import chat from"./src/routes/chat.js";
import auth from"./src/routes/authorize.js";
import Message from"./src/schema/message";

require("dotenv").config();
app.use(express.json());
app.use(cors(["http://127.0.0.1:3000"]));

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
  io.emit("chat message", `User connected`);
  socket.on("disconnect", () => {
    io.emit("chat message", `User disonnected`);
  });

  socket.on("chat message", async (msg, user) => {
    console.log("message: " + msg);
    let newMess = new Message({
      author: user,
      message: msg,
      date: new Date().now,
    });
    await newMess.save().catch((e) => {
      console.log(e);
    });
    io.emit("chat message", `${socket.id}: ${msg}`);
  });
});

app.use("/api", chat);
app.use("/auth", auth)
server.listen(3001, () => {
  console.log("listening on *:3000");
});
