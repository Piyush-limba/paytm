const express = require("express");
const mainRoute=require("./routes/index");
const cors=require("cors");
const app=express();

app.use(cors());
app.use(express.json());
app.use("/api/v1",mainRoute);

console.log("hiii");
app.listen(3000);
