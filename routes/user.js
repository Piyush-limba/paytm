// backend/routes/user.js
const express = require('express');
const router = express.Router();
const z=require("zod");
const {User,Account}=require("../db");
const jwt=require("jsonwebtoken");
const { JWT_SECRET } = require('../config');
const {authMiddleware} =require("../middleware");

const signupBody=z.object({
    username: z.string().email(),
	firstName: z.string(),
	lastName: z.string(),
	password: z.string()
})

router.post("/signup",async(req,res)=>{   
const body=req.body;
console.log(body);
const {success}=signupBody.safeParse(body);

if(!success){
    return res.status(411).json({
        message: "Email already taken / Incorrect inputs"
    })
}

const existinguser=await User.findOne({
    username:body.username
})

if(existinguser){
    return res.status(411).json({
        message: "Email already taken / Incorrect inputs"
    })  
}

const user=await User.create({
    username:body.username,
    password:body.password,
    firstName:body.firstName,
    lastName:body.lastName
})
const userId=user._id;

await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
})

const token=jwt.sign({userId},JWT_SECRET);

res.json({
    message: "User created successfully",
    token: token
})
});

const signinBody=z.object({
    username:z.string().email(),
    password:z.string()
});

router.post("/signin",async(req,res)=>{
const body=req.body;
const {success}=signupBody.safeParse(body);

if(!success){
    return res.status(411).json({
        message: "Email already taken / Incorrect inputs"
    })
}

const user=await User.findOne({
    username:body.username,
    password:body.password
})

if (user) {
    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET);

    res.json({
        token: token
    })
    return;
}


res.status(411).json({
    message: "Error while logging in"
})

});

const updateBody = z.object({
	password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

router.put("/",authMiddleware,async(req,res)=>{
 const body=req.body;
 const {success}=updateBody.safeParse(body);
 if(!success){
    res.status(411).json({
        message: "Error while updating information"
    })
 }
 await User.updateOne({
    _id:body.userId
 },body);

 res.json({
    message: "Updated successfully"
})
})

router.get("/bulk", async (req, res) => {
 const filter = req.query.filter || "";

 const users = await User.find({
    $or: [{
     firstName: {
        "$regex": filter
               }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

 res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router;