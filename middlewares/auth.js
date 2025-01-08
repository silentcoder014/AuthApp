//auth ,isStudent, isAdmin

const jwt = require("jsonwebtoken");
const user = require("../models/user");
require("dotenv").config();

//we have to pass 3 parameters,req,res,next->jab aapka ek middleware khatam hota hai toh aapko next middleware ki call lagani hoti hai 
// ek khatam hua toh dusra call hoga

exports.auth = (req,res,next)=>{

    try{
        //extracting jwt token
        // req ki body se token nikal rhe hai /we can also extract token from cookie,
        //from body and from Header
        //cookie se token lene se pahle cookie parser krna padta wrna code fat jata
        //header wala sbse secure hai
        console.log("body",req.body.token);
        console.log("cookie",req.cookies.token);
        console.log("header",req.header("Authorization")); 
        const token = req.body.token||req.cookies.token||req.header("Authorization").replace("Bearer ","") ;
        
        //agar token presnet hi nhi hai toh
        if(!token ||token ===undefined  ){
            return res.status(401).json({
                success:false,
                message:'Token Missing'
            });
        }
        //token present
        try{
            //to verify token
            const payload = jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
            
            // why this?
            req.user = payload;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:'Token in invalid'
            })
        }

        next();

    }catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while verifying token',
            error:`${error.message}`,
        })
    }
}


exports.isStudent = (req,res,next)=>{
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for student'
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role is not matching'
        })
    }
}

exports.isAdmin = (req,res,next) =>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for admin'
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role is not matching'
        })
    }
}