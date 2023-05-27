import mongo from "mongoose";
export default mongo.model(
  "user-logs",
  new mongo.Schema({
    userId: {type: String, require: true},
    type: {type: String, rerquire: true},
    date: { type: String, require: true },
    ipAddr: {type: String, require: true},
    localization: {type: String, require: true},
    browser: {type: String, require: true},
    action: {type: String, require: true}
  })
);
