import { Router } from "express";
import { celebrate } from "celebrate";
import { registrationSchema } from "../validations/auth/register.schema";
import { loginSchema } from "../validations/auth/login.schema";
import authController from "../controllers/auth";

const authRouter = Router();

authRouter.post(
  "/register",
  celebrate({ body: registrationSchema }),
  authController.register,
);
authRouter.post(
  "/login",
  celebrate({ body: loginSchema }),
  authController.login,
);

authRouter.get("/verify/:otp", authController.verifyOtp);
authRouter.get("/resend-otp/:email", authController.resendOtp);

authRouter.post("/forget-password");

export default authRouter;
