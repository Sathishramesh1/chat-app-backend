import  express  from "express";

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





app.listen(PORT,()=>{
    console.log("server running on ",PORT);  
})