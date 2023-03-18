const mongo = require("mongoose");
module.exports = mongo.model(
  "chats",
  new mongo.Schema({
    creator: { type: String, require: true },
    name: { type: String, require: true },
    code: { type: String, require: true },
    date: { type: String},
  })
);
