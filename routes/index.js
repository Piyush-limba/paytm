const express=require("express");
const router=express.Router();
const app=express();
const userRoute=require('./user');
const accountRoute=require("./account");

app.use('/user',userRoute);
app.use("/account",accountRoute)

module.exports=router;