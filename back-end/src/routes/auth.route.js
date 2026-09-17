const express=require('express');

const authMiddleware=require('../middlewares/auth.middleware');

const authRouter=express.Router();

const authController=require('../controller/auth.controller')



authRouter.post("/register",authController.regesterUser);

authRouter.post("/login",authController.loginUser);
authRouter.get("/logout",authController.logoutUser);

authRouter.get("/get-me", authMiddleware.authenticateToken, authController.getMe);


module.exports=authRouter;