const express = require("express")
const dotenv = require("dotenv").config()
const connection = require("./config/db")
const cors = require("cors")
const userRouter = require("./routes/user.route")
const bookRouter = require("./routes/book.route")
const auth = require("./middleware/auth.middleware")


const app = express()

app.use(express.json())
app.use(cors())
app.use("/user" , userRouter)
app.use("/book" , auth  , bookRouter)

app.get("/" , (req,res)=>{
    res.send(`<h1 style="color : royalblue">WELCOME TO THE LIBRARY APP</h1>`)
})

app.listen(process.env.PORT , ()=>{
    console.log(`PORT ${process.env.PORT} is running in background`)
})