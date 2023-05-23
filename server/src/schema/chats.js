import mongo from "mongoose";
export default mongo.model(
  "chats",
  new mongo.Schema({
    founder: { type: Object, require: true },
    name: { type: String, require: true },
    code: { type: String, require: true },
    date: { type: String},
    users: {type: Array, default: []}
  })
);
