const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//signup route handler
exports.signup = async (req, res) => {
  try {
    //get data
    const { name, email, password, role } = req.body;
    //check if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      //valid entry mili toh aage proceed krne ki koi need nhi false return kro
      return res.status(400).json({
        success: false,
        message: "User already Exists",
      });
    }

    //secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hasing password",
      });
    }

    //jo bhi vyakti signup kr raha tha uski entry saved in Database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User created Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again later",
    });
  }
};


//login Handler
exports.login = async (req, res) => {
  try {
    //data fetch
    const { email, password } = req.body;
    //validation on email and passsword
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }
    //check for registered user
    let user = await User.findOne({ email });
    //if not a registered user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }


    const payload = {
      email:user.email,
      id:user._id,//->is user ki id ko use krke mai db se interaction karke pura ka pura data nnikal sakta hu 
      role:user.role,
    }


    //verify password & generate a JWT token-> jab password verify kr rhe honge tb hum hashing bhi kar rhe honge
    if(await bcrypt.compare(password,user.password)){
      //password matched -> login krwana hai fir

      //creating token using sign method
      let token =jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"2h",
      });
     console.log(user);
      //converting user into object
      user = user.toObject();
      user.token = token;
    
    
    user.password = undefined;
     console.log(user);
      //response me cookie pass kr diya, make sure you have to pass 3 things inside cookie
      // cookie name,cookie data,some options ->like validity

      const options = {
        expires:new Date(Date.now() + 3*24*60*60*1000),
        httpOnly:true,//client side pe access nhi kr skegne
      }
      res.cookie("token",token,options).status(200).json({
        success:true,
        token,
        user,
        message:'User logged in successfully',
      });

      // res.status(200).json({
      //   success:true,
      //   token,
      //   user,
      //   message:'User logged in successfully',
      // });
    }
    else{
      //password do not match
      return res.status(403).json({
        success:false,
        message:'Password Incorrect'
      })
    }
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:'Login Error',
    })
  }
};
