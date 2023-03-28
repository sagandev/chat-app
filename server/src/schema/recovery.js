import mongodb from "mongoose";
const schema = new mongodb.Schema({
    email: {type: String, require: true, unique: true},
    recoveryKey: {type: String, require: true}
});
const Recovery = mongodb.model("recoveryKeys", schema)
export default Recovery;
