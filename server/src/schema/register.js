const mongodb = require("mongoose");
const schema = new mongodb.Schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, minlength: 8, require: true},
    email: {type: String, require: true, unique: true},
    dateOfBirth: {type: String, require: true},
    sex: {type: String, default: "Nie podano", require: true},
    role: {type: String, require: true},
    avatar: {type: String, require: true},
    createdAt: {type: String}
});
const Register = mongodb.model("users", schema)
module.exprts = Register;
