const mongodb = require("mongoose");
const schema = new mongodb.Schema({
    email: {type: String, require: true, unique: true},
    recoveryKey: {type: String, require: true}
});
const Recovery = mongodb.model("recoveryKeys", schema)
module.exports = Recovery;
