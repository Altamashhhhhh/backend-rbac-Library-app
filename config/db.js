const  mongoose = require("mongoose")

const dotenv = require("dotenv").config()

const connection = mongoose.connect(process.env.DATABASE).then(()=>console.log("Database is Connected")).catch(error=>{
    console.log(`Error While connecting database Error :: ${error}`)
})

module.exports = connection ;