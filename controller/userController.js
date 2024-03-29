
import bcrypt from 'bcrypt'
import {User} from '../model/userModel.js';
import crypto from 'crypto'

import jwt from 'jsonwebtoken'


export const allUsers = async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
      try {
        const users = await User.find({
            ...keyword,
            _id: { $ne: req.user._id } 
        }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
    
  };


//function to handle new user registration
export const Register=async(req,res)=>{
 
    try{
        // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    // console.log(user)
    if (user) {
      return res.status(400).send('That user already exisits!');}

    const {password}=req.body;
    const hashedPassword = await bcrypt.hash(password,10);
  

    const newUser= await new User({ ...req.body, password: hashedPassword }).save();

    
    res.status(201).json({
        status:'success',
        message:"new user created"
    })
    }catch(err){
        console.log("error in creating new user",err);
        res.status(500).send("Internal Error");
    }

}


//function to handle the Login process


export const Login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        let user= await User.findOne({email:email});

if (!user) {
    return res.status(401).json({ message: "Email is not Registered" });
      }
  

const passwordMatch = await bcrypt.compare(password, user.password);

if (!passwordMatch) {
         return res.status(401).json({ message: "Wrong Password" });
      }
           
const jwttoken = jwt.sign({id:user._id}, process.env.SECRET_KEY);
        
          res.status(200).json({ jwttoken,user:user._id,message:"login success" });    
    } 
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error")
        
    }

}


//function to activate the account
export const Activate=async(req,res)=>{

try {

    const  {activationKey}=req.params ;
    const decode = jwt.verify(activationKey, process.env.SECRET_KEY).id;
    const user=await User.findOne({email:decode});
    if(!user){

        return res.status(404).json({message:"Unable to Find User"});
    }
    user.isActivated=true ;
    user.save();
    return res.status(201).json({message:"Account activated Successfully"})
    
} catch (error) {
    res.status(500).send('Internal server error');
    console.log(error)
    
}


}



//function to handle Forget Password 
export const Forget = async(req,res)=>{

    try {
         const{email}=req.body;
      const user= await User.findOne({email:email});
      if(!user){
         return res.status(400).send("The email is not Registered");
     }
    
     // Generate a random token
     const token = crypto.randomBytes(25).toString("hex");
    
      // Store the token in the database
      user.resetToken = token;
      await user.save();
      const resetUrl=`https://url-shortner96.netlify.app/reset/${token}`
      //send password resetting mail
      sendMail(email,"password-reset",`
      Click below Link to Reset Your Password
     ${resetUrl}`);
    
      res.status(200).json({message:`The password reset mail send to ${email}`})
    
    } catch (error) {
        console.log("User email not found",error);
        res.status(500).send("Error occured ",error);
    }
    
    
    }

    export const Reset=async(req,res)=>{
    try {
        const { resetToken } = req.params;
        const { password } = req.body;
       console.log(resetToken,"hello")
        // Finding the user  token
      const user = await User.findOne({ resetToken:resetToken });
    
      if (!user) {
        return res.status(404).json({ message: "Invalid token" });
      }
       // Update the user's password and delete token
       user.resetToken = undefined;
       const hashedPassword = await bcrypt.hash(password,10);
       user.password = hashedPassword;
       await user.save();
     
       return res.status(201).json({ message: "Password reset successfully" });
      
        
    } catch (error) {
        res.status(500).send('Internal server error');
        console.log(error)
        
    }
    
    
    }
    

