import express from 'express'
const app = express()
import Chat from "../schema/chats.js"
import Message from '../schema/message.js'
app.get('/chat', async (req, res) => {
    console.log(req.body)
    if (!req.body) return res.status(400).send({ message: "Unauthorized" });
    const {user, code} = req.body;
    if (!user || !code) return res.status(400).send({ message: "Unauthorized" });
    const chats = await Chat.findOne({code: code}).catch(e => {console.log(e)});
    if(!chats) return res.status(400).send({ message: "Chat room doesn't exists" });
})

app.get('/create-chat', async (req, res) => {
    if (!req.body) return res.status(400).send({ message: "Unauthorized" });
    const {user, name, code} = req.body;
    if (!user || !name) return res.status(400).send({ message: "Unauthorized" });
    const newChat = new Chat({creator: user, name: name, code: code, date: Date().now});
    await newChat.save().catch(e => {
        console.log(e)
        return res.status(500).send({ message: "Internal Server Error" });
    });

    res.send(newChat.code)
})
app.get("/global", async (req, res) => {
    const messages = await Message.find({});
    console.log(messages)
    res.send(JSON.stringify(messages))
})
export default app;