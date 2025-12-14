const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));

dotenv.config()
app.get("/",(req, res)=>{
    res.send({msg: "SkillServe API is Running"})
})

// Connect DB
connectDB()


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at Port ${process.env.PORT}`);    
});