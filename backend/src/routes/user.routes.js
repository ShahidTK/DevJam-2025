import { Router } from "express";   
import {loginUser, registerUser,logoutUser, getCurrentUser} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/getuserid", getCurrentUser );



export default userRouter;
