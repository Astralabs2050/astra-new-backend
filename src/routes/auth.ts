import { Router } from "express";


import authController from "../controllers/auth";

const authRouter = Router();

authRouter.post(
  "/register",
  authController.register,
);
authRouter.post(
  "/login",
  authController.login,
);

authRouter.get("/verify/:otp", authController.verifyOtp);
authRouter.get("/resend-otp/:email", authController.resendOtp);

authRouter.post("/forget-password");

export default authRouter;
