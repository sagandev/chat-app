import express from 'express'
const app = express()
import uniqueString from 'unique-string';
import Chat from "../schema/chats.js"
import User from '../schema/user.js'
import Logs from '../schema/login-logs.js'
app.get('/avatar', async (req, res) => {
    if (!req.body) return res.status(400).send({ message: "Unauthorized" });
    const {user, avatar} = req.body;
    if (!user || !avatar) return res.status(400).send({ message: "Unauthorized" });
    const chats = await Chat.findOne({code: code}).catch(e => {console.log(e)});
    if(!chats) return res.status(400).send({ message: "Chat room doesn't exists" });
})
app.post('/logs', async (req, res) => {
    if (!req.body) return res.status(400).send({ message: "Unauthorized" });
    const {id} = req.body;
    if (!id) return res.status(400).send({ message: "Unauthorized" });
    const logs = await Logs.find({userId: id}).catch(e => {console.log(e)});
    if(!logs) return res.status(400).send({ message: "No logs" });
    res.send(logs)
})
export default app;