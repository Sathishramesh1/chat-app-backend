import express from 'express'
import { accessChat, createGroupChat, getChat } from '../controller/chatController.js';



const router=express.Router();

//to create personal chat
router.route("/").post(accessChat);

//to get all my chats
router.route("/").get(getChat);

//to create a group chat
router.route("/group").post(createGroupChat);

router.route("/rename").put()
router.route("/groupremove").put();
router.route("/groupadd").put();









export {router as ChatRouter}