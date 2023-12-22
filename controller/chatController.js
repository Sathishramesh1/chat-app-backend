import mongoose from "mongoose";
import { Chat } from "../model/chatModel";


const accessChat=async(req,res)=>{
    
    const {userId}=req.body;

    if(!userId){
        console.log("UserId param not sent with req");
    return res.status(400).send("unable to find the userId");
}

const isChat=await Chat.find({
    
})

}
