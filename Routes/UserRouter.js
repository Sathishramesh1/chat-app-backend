import express from 'express'
import {Register, allUsers} from '../controller/userController.js'
import {Login} from '../controller/userController.js'
import {Forget} from '../controller/userController.js'
import {Reset} from '../controller/userController.js'


const router=express.Router();

//route for registering new user
router.route('/register').post(Register);

//route for login
router.route('/login').post(Login);

router.route('/alluser').get(allUsers);

//route for generating password reset mail
router.route('/forget').post(Forget);

//route for resetting new password
router.route('/reset').post(Reset);




export {router as UserRouter}