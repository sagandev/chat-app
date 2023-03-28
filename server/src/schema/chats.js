import mongo from "mongoose";
export default mongo.model(
  "chats",
  new mongo.Schema({
    creator: { type: String, require: true },
    name: { type: String, require: true },
    code: { type: String, require: true },
    date: { type: String},
  })
);
