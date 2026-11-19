import { Router } from "express";
import {syncUser } from '../controllers/userController'





const route = Router();


route.post('/sync',syncUser)




export default route

