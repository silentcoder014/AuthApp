const express = require('express');
const router = express.Router();
const  User = require("../models/user");
const {login,signup} =require("../controllers/Auth");
const{auth,isStudent,isAdmin} = require("../middlewares/auth");

router.post("/login",login);
router.post("/signup",signup);

 
//testing route
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the Protected route for Test'
    });
});

//protected route likh rhe hai
// mujhe batana padega ki /student wale path me kaun kaun se middle ware use honge
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the Protected route for Students'
    })
});

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the Protected route for Admin'
    });
})


// how to use id -> example given 
//  router.get("/getEmail",auth,async (req,res)=>{

//     try{
//     const id = req.user.id;
//     console.log(id);
//     const user  = await User.findById(id);
//     res.status(200).json({
//         success:true,
//         user:user,
//         message:"Welcome to the email route"
//     })
//     }catch(error){
//         res.status(500).json({
//             success:false,
//             user:error.message,
//             message:"Fat gaya code"
//         })
//     }
    
// });

module.exports = router;