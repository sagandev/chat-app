import express from 'express'
const app = express()
import uniqueString from 'unique-string';
import Chat from "../schema/chats.js"
import User from '../schema/user.js'
app.post('/room', async (req, res) => {
    if (!req.body) return res.status(400).send({ message: "Unauthorized" });
    const {id} = req.body;
    if (!id || id.length !== 24) return res.status(400).send({ message: "Unauthorized" });
    const chats = await Chat.findById(id).catch(e => {console.log(e)});
    if(!chats) return res.send({valid: false});
})
app.post('/chats', async(req, res) => {
    if (!req.body) return res.status(400).send({ message: "Unauthorized" });
    const {user} = req.body;
    if (!user) return res.status(400).send({ message: "Unauthorized" });
    const userJoinedRooms = await User.findById(user.id).catch(e => {console.log(e)});
    const chats = await Chat.find({_id: {$in: userJoinedRooms.joinedChats}}).catch(e => {console.log(e)});
    if(!chats) return res.status(400).send({ message: "You don't have chats yet!" });
    res.send(chats)
})
app.post('/join-room', async(req, res) => {
    if (!req.body) return res.status(400).send({ message: "Unauthorized" });
    const {user, code} = req.body;
    if (!user || !code) return res.status(400).send({ message: "Unauthorized" });
    const Room = await Chat.findOne({code: code}).catch(e => {console.log(e)});
    if (!Room) return res.status(400).send("Invalid access code")
    const appendRoom = await Chat.findOneAndUpdate({code: code}, {$push: {users: user._id}}).catch(e => {console.log(e)});
    const updateUser = await User.findByIdAndUpdate(user._id, {$push: {joinedChats: newChat._id}}).catch(e => {console.log(e)});
    if(!appendRoom) return res.status(400).send({ message: "An error was encountered while joining the room" });
    res.send(appendRoom)
})
app.post('/create-room', async (req, res) => {
    if (!req.body) return res.status(400).send({ message: "Unauthorized" });
    const {user, name} = req.body;
    if (!user || !name) return res.status(400).send({ message: "Unauthorized" });
    const code = uniqueString()
    const newChat = new Chat({founder: user.id, name: name, code: code, date: Date().now, users: [user.id]});
    await newChat.save().catch(e => {
        console.log(e)
        return res.status(500).send({ message: "Internal Server Error" });
    });
    const updateUser = await User.findByIdAndUpdate(user.id, {$push: {joinedChats: newChat._id}}).catch(e => {console.log(e)});
    res.send(newChat.code)
})

app.get("/global", async (req, res) => {
    const messages = await Message.find({});
    res.send(JSON.stringify(messages))
})
export default app;