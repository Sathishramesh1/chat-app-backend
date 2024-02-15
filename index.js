import  express  from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors'
import dotenv from 'dotenv'
import { dbconnection } from "./config/dataBase.js";
import { UserRouter } from "./Routes/UserRouter.js";
import { isAuthorized } from "./middleware/isAuthorised.js";
import { ChatRouter } from "./Routes/ChatRouter.js";
import { MessageRoute } from "./Routes/MessageRouter.js";

//configuration .env files
dotenv.config();


//assign app to express server
const app=express();
app.use(cors());
app.use(express.json());


//database connection
dbconnection();

const PORT=process.env.PORT;

//ROUTES
app.use("/api",UserRouter);
app.use("/chat",isAuthorized,ChatRouter);
app.use("/message",isAuthorized,MessageRoute);

app.get("/",(req,res)=>{
    res.status(200).send("server working");
})






const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors:{
        origin:"*",

    },
    pingTimeout:60000
 });

 io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("setup",(user)=>{
        socket.join(user.data.id);
        socket.emit("connected")

    });

    socket.on("join chat",(room)=>{
        console.log(room)
        socket.join(room)

    });

    socket.on("new message",(newMessage)=>{
     const chat=newMessage.chat;
     if(!chat){
        return console.log("chat.user is not defined");
     }
     chat.users.forEach((user)=>{

     if(user._id==newMessage.sender._id) return;
     socket.in(user._id).emit("message received",messageReceived)
        
     });

    })
    // Example: Listen for a "disconnect" event
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
  
  // Start the HTTP server
httpServer.listen(PORT, () => {
    console.log("Server running on ", PORT);
});