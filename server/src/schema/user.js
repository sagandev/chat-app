import mongodb from "mongoose";
const schema = new mongodb.Schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, minlength: 8, require: true},
    email: {type: String, require: true, unique: true},
    dateOfBirth: {type: String, require: true},
    sex: {type: String, default: "N/A", require: true},
    role: {type: String, require: true},
    avatar: {
        name: {type: String},
        type: {type: String},
        imgDate: {type: Buffer}
    },
    createdAt: {type: String},
    avatarColor: {type: String},
    joinedChats: {type: Array}
});
const User = mongodb.model("users", schema)
export default User;
