
const express = require("express");
require("dotenv").config();
const app = express();
const mongoose  = require("mongoose")
// const {mongoUrl} = require('./keys.js')
require('./models/model.js')
require('./models/post.js')


const PORT = process.env.PORT || 5001;
const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(require('./routes/auth.js'))
app.use(require('./routes/createPost.js'))
app.use(require('./routes/user.js'))

//connect mongodb
mongoose.connect(process.env.mongoUrl)

mongoose.connection.on("connected", ()=>{
    console.log("Successfully connected to mongodb")
})
mongoose.connection.on("error", ()=>{
    console.log("not connected to mongodb")
})




app.listen(PORT, ()=>{
    console.log('server is listening on port '+ PORT)
})