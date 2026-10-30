const mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is Required"]
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true
    },
    age:{
        type:Number,
        required:[true,"Age is Required"],
        min:16

    },
    password:{
        type:String,
        required:[true,"password is Required"],
        minlength:6
    }
},{timestamps:true});

let userModel = mongoose.model("users",userSchema);
module.exports = userModel;
