const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : {type : String , required : true},
    email : {type : String , required : true  , unique : true },
    role : {type : String ,  default : "view_all" , enum : ["view_all" , "viewer" , "creator"]},
    password : {type : String , required : true},
})

const userModel = mongoose.model("User" , userSchema)

module.exports = userModel 