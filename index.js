const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT||4000;

//cookie-parser- what is this and why do we need this
const cookieparser = require("cookie-parser");
app.use(cookieparser());

app.use(express.json());

require("./config/database").connect();
//route import and mount
const user = require("./routes/user");

app.use("/api/v1",user);
app.get("/",(req,res)=>{
    res.send("Hii, You are on the homepage ")
})

app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
})