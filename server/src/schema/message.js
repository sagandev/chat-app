const mongo = require("mongoose");
module.exports = mongo.model(
  "message",
  new mongo.Schema({
    author: { type: String, require: true },
    message: { type: String, require: true },
    date: { type: String, require: true },
    likes: { type: Number },
  })
);
