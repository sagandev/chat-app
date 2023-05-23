import mongo from "mongoose";
export default mongo.model(
  "message",
  new mongo.Schema({
    roomId: {type: String, require: true},
    author: { type: Object, require: true },
    message: { type: String, require: true },
    date: { type: String, require: true }
  })
)