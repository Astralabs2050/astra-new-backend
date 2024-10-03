import { Router } from "express";

import {AuthController} from "../controllers/auth.controller";

const authRouter = Router();
const authcontroller = new AuthController();

authRouter.post("/register/brand", authcontroller.registerBrand.bind(authcontroller));
// authRouter.post("/login", authController.login);

// authRouter.get("/verify/:otp", authController.verifyOtp);
// authRouter.get("/resend-otp/:email", authController.resendOtp);

// authRouter.post("/forget-password");

export default authRouter;
