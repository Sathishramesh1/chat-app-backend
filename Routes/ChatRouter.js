import express from 'express'
import { accessChat } from '../controller/chatController.js';



const router=express.Router();


router.route("/").post(accessChat);








export {router as ChatRouter}