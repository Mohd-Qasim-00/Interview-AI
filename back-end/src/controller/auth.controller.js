const User=require('../module/user.module');
 require('dotenv').config();
 const config=require('../config/config');
const bcrypt=require('bcryptjs');

const tokenBlacklist=require('../module/blacklist.module');

const jwt=require('jsonwebtoken');

const cookieParser = require('cookie-parser');

async function regesterUser(req ,res){

  const {username,email,password}=req.body;

  if(!username || !email || !password){
    return res.status(400).json({message: 'Please fill in all fields'});
  }

  const userExists=await User.findOne(
    
   { $or: [{username},{email}] });

  if(userExists){
    return res.status(400).json({message: 'User already exists'});
  }

  const hashedPassword=await bcrypt.hash(password,10);

  const user=await User.create({
    username,
    email,
    password:hashedPassword
  });

  const token=jwt.sign({id:user._id,username:user.username},config.jwtSecret,{expiresIn:'1h'});

res.cookie('token',token);

return res.status(201).json({message: 'User registered successfully',
  user:{
    id:user._id,
    username:user.username,
    email:user.email,
  },
  token:token

});

}


async function loginUser(req,res){

  const {email,password}=req.body;

  const user=await User.findOne({email});

  if(!user){
    return res.status(400).json({message: 'User not found'});
  }

const isMatch=await bcrypt.compare(password,user.password);

if(!isMatch){
  return res.status(400).json({message: 'Invalid credentials'});

}

const token=jwt.sign({id:user._id,username:user.username},config.jwtSecret,{expiresIn:'1h'});

res.cookie('token',token);

console.log("User logged in:", { id: user._id, username: user.username, email: user.email });

return res.status(200).json({message: 'User logged in successfully',
  user:{
    id:user._id,
    username:user.username,
    email:user.email,
  }
});




}

async function logoutUser(req,res){
  const token=req.cookies.token;

  if(token){
    await tokenBlacklist.create({token});

  }
 res.clearCookie('token');
 return res.status(200).json({message: 'User logged out successfully'});

}

async function getMe(req,res){

  const user = await User.findById(req.user.id);

  return res.status(200).json({ 
    message: 'User information retrieved successfully',
    user:{
    id:user._id,
    username:user.username,
    email:user.email,
  } });
}

module.exports={regesterUser,loginUser,logoutUser,getMe};