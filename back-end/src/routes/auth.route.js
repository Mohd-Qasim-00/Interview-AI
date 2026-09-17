const express=require('express');

const authMiddleware=require('../middlewares/auth.middleware');

const authRouter=express.Router();

const authController=require('../controller/auth.controller')
const connectDB=require('../config/databse')

async function connectDBMiddleware(req, res, next) {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
}


authRouter.post("/register", connectDBMiddleware, authController.regesterUser);

authRouter.post("/login", connectDBMiddleware, authController.loginUser);
authRouter.get("/logout",authController.logoutUser);

authRouter.get("/get-me", authMiddleware.authenticateToken, authController.getMe);


module.exports=authRouter;
