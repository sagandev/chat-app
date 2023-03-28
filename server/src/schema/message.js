import mongo from "mongoose";
export default mongo.model(
  "message",
  new mongo.Schema({
    author: { type: Object, require: true },
    message: { type: String, require: true },
    date: { type: String, require: true },
    likes: { type: Number },
  })
);
