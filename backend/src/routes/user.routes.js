import { Router } from "express";   
import registerUser from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/signup", registerUser);  // Correct route

export default userRouter;
