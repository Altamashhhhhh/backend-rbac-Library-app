const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title : {type : String , required : true , unique : true},
    description : {type : String , required : true },
    price : {type : Number , required : true },
    createdBy : {type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true} , 
    createdAt : {type : Date , default : Date.now}
})

const bookModel = mongoose.model("Book" , bookSchema)

module.exports = bookModel 