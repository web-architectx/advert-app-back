import { Router } from "express";
import { registerUser, loginUser, getUserProducts, getProfile } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";


const userRouter = Router();

userRouter.post('/users/register', registerUser);
userRouter.post('/users/login', loginUser);
userRouter.get('/users/profile', isAuthenticated, getProfile);

userRouter.get('/users/me/products', isAuthenticated, getUserProducts);

export default userRouter;