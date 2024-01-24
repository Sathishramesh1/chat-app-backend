
import { Chat } from "../model/chatModel.js";
import { User } from "../model/userModel.js";



// function to post message on single chat
export const accessChat=async(req,res)=>{

    const {userId}=req.body;

    if(!userId){
        console.log("UserId param not sent with req");
    return res.status(400).send("unable to find the userId");}

var isChat=await Chat.find({
    isGroupChat:false,
    $and:[
        {users:{$elemMatch:{$eq:req.user._id}}},
        {users:{$elemMatch:{$eq:userId}}},
    ]    
}).populate("users","-password").populate("latestMessage");

isChat=await User.populate(isChat,{
    path: "latestMessage.sender",
    select:"name pic email",
});

if(isChat.length>0){
    res.status(200).send(isChat[0]);
} else{
    var chatData={
        chatName:"sender",
        isGroupChat:false,
        users:[req.user._id,userId],
};
}

try {
    const createChat=await Chat.create(chatData);
    const FullChat= await Chat.findOne({_id:createChat._id}).populate("users","-password");

    res.status(200).send(FullChat);
    
} catch (error) {
    res.status(400).send(error);

}
}


//function to get  chat history

export const getChat=async (req,res)=>{

    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
          .populate("users", "-password")
        //   .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({ updatedAt: -1 })
          .then(async (results) => {
            
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name pic email",
            });
            res.status(200).send(results);
          });
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }

}


//to create group chat
export const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the fields"});
    }
  
    // var users = JSON.parse(req.body.users);
    const users=req.body.users
  
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  
    users.push(req.user);
  
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
  
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400).send("Unable to create a group");
      
    }
  };
  